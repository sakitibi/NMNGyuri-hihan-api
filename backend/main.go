package main

import (
	"fmt"
	"time"

	"github.com/otiai10/gosseract/v2"
)

func main() {
	client := gosseract.NewClient()
	client.SetLanguage("jpn", "eng")
	defer client.Close()

	fmt.Println("\033[92m\033[1m--- 名前は長い方が有利を監視中 ---\033[0m")

	for {
		timestamp := time.Now().Format("15:04:05")
		detectType, detectedText := checkScreen(client)

		// QF1003: switch文を使うことで可読性が向上し、静的解析の指摘も解消されます
		switch detectType {
		case "RED":
			logMsg := fmt.Sprintf("荒らし検知!! (%s)", detectedText)
			fmt.Printf("\033[91m\033[1m[%s] %s\033[0m\n", timestamp, logMsg)

			writeLog(logMsg) // log.txtへの書き込み
			playSoundAsync("sound1.mp3")
			macNotify("警告", "荒らしを検知しました")

			time.Sleep(12 * time.Second)

		case "BLUE":
			// 「乱す」などの誤検知が含まれていても、ここでログに記録されます
			logMsg := fmt.Sprintf("ゲーム終了検知!! (%s)", detectedText)
			fmt.Printf("\033[93m\033[1m[%s] %s\033[0m\n", timestamp, logMsg)

			writeLog(logMsg) // BLUEも確実にlog.txtへ書き込み
			playSoundAsync("sound2.mp3")
			macNotify("通知", "ゲーム終了を検知しました")

			time.Sleep(12 * time.Second)

		default:
			// 何も検知されなかった場合
			time.Sleep(1 * time.Second)
		}
	}
}
