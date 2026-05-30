import numpy as np
import cv2
import easyocr
from PIL import ImageGrab, Image
import warnings

# OCRの初期化（一度だけ行う）
warnings.filterwarnings("ignore", category=UserWarning, module="torch")
reader: easyocr.Reader = easyocr.Reader(['ja', 'en'])

# 座標設定
BBOX_RED: tuple = (80, 500, 430, 590)
BBOX_BLUE: tuple = (85, 195, 300, 260)

def preprocess_red(image: Image):
    img = np.array(image)
    img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    img_res = cv2.resize(img_bgr, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)
    hsv = cv2.cvtColor(img_res, cv2.COLOR_BGR2HSV)
    mask = cv2.bitwise_or(cv2.inRange(hsv, np.array([0, 60, 60]), np.array([15, 255, 255])),
                          cv2.inRange(hsv, np.array([160, 60, 60]), np.array([180, 255, 255])))
    return mask

def preprocess_blue(image: Image):
    img = np.array(image)
    img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    img_res = cv2.resize(img_bgr, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    hsv = cv2.cvtColor(img_res, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, np.array([100, 50, 50]), np.array([130, 255, 255]))
    mask_inv = cv2.bitwise_not(mask)
    res = cv2.bitwise_and(img_res, img_res, mask=mask_inv)
    return cv2.cvtColor(res, cv2.COLOR_BGR2GRAY)

def check_screen():
    """
    画面をチェックして、検知したテキストとタイプを返す
    """
    # 赤文字チェック
    shot_red: Image = ImageGrab.grab(bbox=BBOX_RED)
    proc_red = preprocess_red(shot_red)
    txt_red = "".join([res[1] for res in reader.readtext(proc_red)]).strip()
    
    if any(k in txt_red for k in ["バン", "追い出", "されました", "により"]) and len(txt_red) >= 4:
        return "RED", txt_red

    # 青文字チェック
    shot_blue: Image = ImageGrab.grab(bbox=BBOX_BLUE)
    proc_blue: Image = preprocess_blue(shot_blue)
    txt_blue: str = "".join([res[1] for res in reader.readtext(proc_blue)]).strip()
    blue_keywords: list[str] = [
        "結果", "純興", "菊果", "隠す", "結界", "関す",
        "を関", "火す", "を火", "果を", "を隠", "筒黒",
        "口す"
    ]
    if any(k in txt_blue for k in blue_keywords):
        return "BLUE", txt_blue

    return None, ""