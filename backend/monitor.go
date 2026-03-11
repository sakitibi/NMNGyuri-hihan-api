package main

import (
	"fmt"
	"image"
	"strings"

	"github.com/kbinani/screenshot"
	"github.com/otiai10/gosseract/v2"
	"gocv.io/x/gocv"
)

var (
	BBOX_RED  = image.Rect(80, 500, 430, 590)
	BBOX_BLUE = image.Rect(85, 195, 300, 260)
)

// 色の抽出を安定させる汎用関数
func extractColor(img gocv.Mat, lower1, upper1, lower2, upper2 gocv.Scalar) gocv.Mat {
	hsv := gocv.NewMat()
	defer hsv.Close()
	gocv.CvtColor(img, &hsv, gocv.ColorBGRToHSV)

	mask1 := gocv.NewMat()
	defer mask1.Close()
	gocv.InRangeWithScalar(hsv, lower1, upper1, &mask1)

	finalMask := gocv.NewMat()
	if lower2 != (gocv.Scalar{}) {
		mask2 := gocv.NewMat()
		defer mask2.Close()
		gocv.InRangeWithScalar(hsv, lower2, upper2, &mask2)
		gocv.BitwiseOr(mask1, mask2, &finalMask)
	} else {
		mask1.CopyTo(&finalMask)
	}

	// 文字を太らせてOCR認識率を上げる (Dilation)
	kernel := gocv.GetStructuringElement(gocv.MorphRect, image.Pt(2, 2))
	defer kernel.Close()
	dilated := gocv.NewMat()
	gocv.Dilate(finalMask, &dilated, kernel)
	finalMask.Close()

	return dilated
}

func preprocessRed(img gocv.Mat) gocv.Mat {
	res := gocv.NewMat()
	gocv.Resize(img, &res, image.Point{}, 4, 4, gocv.InterpolationCubic)
	defer res.Close()

	// 【修正】S(彩度)とV(明度)の下限を 10 まで下げて、暗い色を拾うようにします
	mask := extractColor(res,
		// 通常の赤（暗め対応版）
		gocv.NewScalar(0, 10, 10, 0), gocv.NewScalar(20, 255, 255, 0),
		// 青紫〜赤の終わり（暗め対応版）
		gocv.NewScalar(130, 10, 10, 0), gocv.NewScalar(180, 255, 255, 0),
	)

	final := gocv.NewMat()
	gocv.BitwiseNot(mask, &final) // 白背景・黒文字化
	mask.Close()
	return final
}

// 青文字エリア（暗い水色背景に白文字）用の前処理
func preprocessBlue(img gocv.Mat) gocv.Mat {
	// 1. 2倍にリサイズ
	res := gocv.NewMat()
	gocv.Resize(img, &res, image.Point{}, 2, 2, gocv.InterpolationCubic)
	defer res.Close()

	// 2. HSV変換
	hsv := gocv.NewMat()
	defer hsv.Close()
	gocv.CvtColor(res, &hsv, gocv.ColorBGRToHSV)

	// 3. 「白文字」を抽出する範囲設定
	mask := gocv.NewMat()
	defer mask.Close()

	// H: 0-180 (全色対象)
	// S: 0-60   (彩度が低い = 白に近い色)
	// V: 150-255 (明度が高い = 背景の暗い水色を切り捨てる)
	lowerWhite := gocv.NewScalar(0, 0, 150, 0)
	upperWhite := gocv.NewScalar(180, 60, 255, 0)
	gocv.InRangeWithScalar(hsv, lowerWhite, upperWhite, &mask)

	// 4. ノイズ除去と文字の強調
	kernel := gocv.GetStructuringElement(gocv.MorphRect, image.Pt(2, 2))
	defer kernel.Close()
	dilated := gocv.NewMat()
	gocv.Dilate(mask, &dilated, kernel)
	defer dilated.Close()

	// 5. 白黒反転 (OCR用: 黒文字/白背景)
	finalMat := gocv.NewMat()
	gocv.BitwiseNot(dilated, &finalMat)

	return finalMat
}

func checkScreen(client *gosseract.Client) (string, string) {
	// --- 赤文字チェック ---
	imgRed, err := screenshot.CaptureRect(BBOX_RED)
	if err == nil {
		matRaw, _ := gocv.ImageToMatRGBA(imgRed)
		defer matRaw.Close()

		// チャンネル変換を一度「なし」で試して、0_raw_captureを確認してください
		// もし青紫になるなら BGRAToBGR を使います
		matBGR := gocv.NewMat()
		defer matBGR.Close()
		gocv.CvtColor(matRaw, &matBGR, gocv.ColorBGRAToBGR)

		gocv.IMWrite("0_raw_capture_red.png", matBGR)

		procRed := preprocessRed(matBGR)
		defer procRed.Close()
		gocv.IMWrite("debug_red_input.png", procRed)

		buf, _ := gocv.IMEncode(".png", procRed)
		client.SetImageFromBytes(buf.GetBytes())
		client.SetPageSegMode(gosseract.PSM_SINGLE_LINE)
		txtRed, _ := client.Text()
		txtRed = strings.TrimSpace(txtRed)

		if txtRed != "" {
			fmt.Printf("[Debug RED] OCR: %s\n", txtRed)
		}

		keywords := []string{"バン", "追い出", "されました", "により"}
		for _, k := range keywords {
			if strings.Contains(txtRed, k) {
				return "RED", txtRed
			}
		}
	}

	// --- 青文字チェック ---
	imgBlue, err := screenshot.CaptureRect(BBOX_BLUE)
	if err == nil {
		matRaw, _ := gocv.ImageToMatRGBA(imgBlue)
		defer matRaw.Close()
		matBGR := gocv.NewMat()
		defer matBGR.Close()
		gocv.CvtColor(matRaw, &matBGR, gocv.ColorBGRAToBGR)

		procBlue := preprocessBlue(matBGR)
		defer procBlue.Close()
		gocv.IMWrite("debug_blue_input.png", procBlue)

		bufBlue, _ := gocv.IMEncode(".png", procBlue)
		client.SetImageFromBytes(bufBlue.GetBytes())
		txtBlue, _ := client.Text()
		txtBlue = strings.TrimSpace(txtBlue)

		if txtBlue != "" {
			fmt.Printf("[Debug BLUE] OCR Result: %s\n", txtBlue)
		}

		blueKeywords := []string{"結果", "純興", "菊果", "隠す", "結界", "関す"}
		for _, k := range blueKeywords {
			if strings.Contains(txtBlue, k) {
				return "BLUE", txtBlue
			}
		}
	}
	return "", ""
}
