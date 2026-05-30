import time
import sys
from utils import write_log, play_sound_async, mac_notify
from monitor import check_screen

def start_monitoring():
    try:
        while True:
            timestamp = time.strftime('%H:%M:%S')
            
            # monitor.pyに画面チェックを任せる
            detect_type, detected_text = check_screen()

            if detect_type == "RED":
                log_msg = f"荒らし検知!! ({detected_text})"
                print(f"\033[91m\033[1m[{timestamp}] {log_msg}\033[0m")
                write_log(log_msg)
                play_sound_async("sound1.mp3")
                mac_notify("警告", "荒らしを検知しました")
                
                print(f"[{time.strftime('%H:%M:%S')}] 12秒待機します...")
                time.sleep(12)
                
            elif detect_type == "BLUE":
                log_msg = f"ゲーム終了検知!! ({detected_text})"
                print(f"\033[93m\033[1m[{timestamp}] {log_msg}\033[0m")
                write_log(log_msg)
                play_sound_async("sound2.mp3")
                mac_notify("警告", "ゲーム終了を検知しました")
                
                print(f"[{time.strftime('%H:%M:%S')}] 12秒待機します...")
                time.sleep(12)
                
            else:
                # 何も検知しなければ1秒待機
                time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n監視を終了します。")
        sys.exit(0)

if __name__ == "__main__":
    print("\033[92m\033[1m--- 監視中 (検知時12秒待機 / 通常1秒スキャン) ---\033[0m")
    start_monitoring()