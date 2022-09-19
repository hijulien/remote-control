const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const {
    mouse,
    screen,
    keyboard,
    straightTo,
    centerOf,
    Point,
    Region,
    Button,
    Key
} = require("@nut-tree/nut-js");
const path = require('path');

mouse.config.autoDelayMs = 1;
mouse.config.mouseSpeed = 100;
let w = 0;
let h = 0;

screen.width().then(arg => w = arg)
screen.height().then(arg => h = arg)

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    ipcMain.on("mouse-event", (event, arg) => {
        switch (arg.type) {
            case "leftClick":
                (async () => {
                    await mouse.setPosition(new Point(Math.floor(arg.X * w), Math.floor(arg.Y * h)));
                    await mouse.click(Button.LEFT);
                })();
                break;

            case "rightClick":
                (async () => {
                    await mouse.setPosition(new Point(Math.floor(arg.X * w), Math.floor(arg.Y * h)));
                    await mouse.click(Button.RIGHT);
                })();
                break;

            case "upWheel":
                (async () => {
                    console.log("向上滚动");
                    await mouse.scrollUp(120);
                })();
                break;

            case "downWheel":
                (async () => {
                    console.log("向下滚动");
                    await mouse.scrollDown(120);
                })();
                break;

            case "mouseMove":
                (async () => {
                    await mouse.setPosition(new Point(Math.floor(arg.X * w), Math.floor(arg.Y * h)));
                })();
                break;

            case "drag":
                (async () => {
                    console.log("拖动");
                    await mouse.drag(straightTo(centerOf(new Region(0, 0, 100, 100))));
                })();
                break;
            default:
                console.log("error");
        }
    });

    //键盘事件
    ipcMain.on("key-event", (event, arg) => {
        switch (arg.value) {

            case "Shift":
                (async () => {
                    await keyboard.pressKey(Key.LeftShift);
                    await keyboard.releaseKey(Key.LeftShift);
                })();
                break;

            case "Control":
                (async () => {
                    await keyboard.pressKey(Key.LeftControl);
                    await keyboard.releaseKey(Key.LeftControl);
                })();
                break;

            case "Alt":
                (async () => {
                    await keyboard.pressKey(Key.LeftAlt);
                    await keyboard.releaseKey(Key.LeftAlt);
                })();
                break;

            case "Meta":
                (async () => {
                    await keyboard.pressKey(Key.LeftSuper);
                    await keyboard.releaseKey(Key.LeftSuper);
                })();
                break;

            case "[":
                (async () => {
                    await keyboard.pressKey(Key.LeftBracket);
                    await keyboard.releaseKey(Key.LeftBracket);
                })();
                break;

            case "]":
                (async () => {
                    await keyboard.pressKey(Key.RightBracket);
                    await keyboard.releaseKey(Key.RightBracket);
                })();
                break;

            case "{":
                (async () => {
                    await keyboard.pressKey(7, Key.LeftBracket);
                    await keyboard.releaseKey(7, Key.LeftBracket);
                })();
                break;

            case "}":
                (async () => {
                    await keyboard.pressKey(7, Key.RightBracket);
                    await keyboard.releaseKey(7, Key.RightBracket);
                })();
                break;

            case "AudioVolumeMute":
                (async () => {
                    await keyboard.pressKey(Key.AudioMute);
                    await keyboard.releaseKey(Key.AudioMute);
                })();
                break;

            case "AudioVolumeUp":
                (async () => {
                    await keyboard.pressKey(Key.AudioVolUp);
                    await keyboard.releaseKey(Key.AudioVolUp);
                })();
                break;

            case "AudioVolumeDown":
                (async () => {
                    await keyboard.pressKey(Key.AudioVolDown);
                    await keyboard.releaseKey(Key.AudioVolDown);
                })();
                break;

            default:
                (async () => {
                    if (!arg.ctrlKey && !arg.shiftKey) {
                        await keyboard.pressKey(Key[arg.value]);
                        await keyboard.releaseKey(Key[arg.value]);
                    } else
                    if (arg.shiftKey && !arg.ctrlKey) {
                        console.log("shift key");
                        await keyboard.pressKey(7, Key[arg.value]);
                        await keyboard.releaseKey(7, Key[arg.value]);
                    } else
                    if (!arg.shiftKey && arg.ctrlKey) {
                        await keyboard.pressKey(4, Key[arg.value]);
                        await keyboard.releaseKey(4, Key[arg.value]);
                    } else {
                        console.log("ctrl shift key");
                    }
                })();
                break;
        }
    });

    mainWindow.loadURL(path.join(__dirname, './build/index.html'));
}


app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})