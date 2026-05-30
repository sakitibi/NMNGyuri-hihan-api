import time
import subprocess
import threading

def write_log(message):
    """日時付きで log.txt に追記"""
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    log_line = f"[{timestamp}] {message}\n"
    with open("log.txt", "a", encoding="utf-8") as f:
        f.write(log_line)

def play_sound_async(file_path):
    """汎用的な音声再生"""
    def play():
        try:
            subprocess.run(["afplay", file_path], check=True)
        except Exception: pass
    threading.Thread(target=play).start()

def mac_notify(title, message):
    """Macのシステム通知\n="""
    apple_script = f'display notification "{message}" with title "{title}"'
    subprocess.run(["osascript", "-e", apple_script])