"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
function openMeet(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield driver.get('https://meet.google.com/qhk-tcbg-zyp');
            const popupButton = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//span[contains(text(), "Got it")]')), 10000);
            popupButton.click();
            const nameInput = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//input[@placeholder="Your name"]')), 10000);
            yield nameInput.clear();
            yield nameInput.click();
            yield nameInput.sendKeys("Meeting Bot");
            const buttonInput = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//span[contains(text(),"Ask to join")]')), 10000);
            buttonInput.click();
        }
        catch (error) {
        }
    });
}
function getDriver() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = new chrome_1.Options({});
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--use-fake-ui-for-media-stream");
        options.addArguments("--window-size=1080,720");
        options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
        options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
        options.addArguments('--enable-usermedia-screen-capturing');
        options.addArguments('--auto-select-tab-capture-source-by-title="Meet"');
        let driver = yield new selenium_webdriver_1.Builder().forBrowser(selenium_webdriver_1.Browser.CHROME).setChromeOptions(options).build();
        return driver;
    });
}
function startScreenshare(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("startScreensharecalled");
        const response = yield driver.executeScript(`

      function wait(delayInMS) {
          return new Promise((resolve) => setTimeout(resolve, delayInMS));
      }

      function startRecording(stream, lengthInMS) {
          let recorder = new MediaRecorder(stream);
          let data = [];
          
          recorder.ondataavailable = (event) => data.push(event.data);
          recorder.start();
          
          let stopped = new Promise((resolve, reject) => {
              recorder.onstop = resolve;
              recorder.onerror = (event) => reject(event.name);
          });
          
          let recorded = wait(lengthInMS).then(() => {
              if (recorder.state === "recording") {
              recorder.stop();
              }
          });
          
          return Promise.all([stopped, recorded]).then(() => data);
      }
    
      console.log("before mediadevices")
      window.navigator.mediaDevices.getDisplayMedia(
      {
          video: {
            displaySurface: "browser"
          },
          audio: true,
          preferCurrentTab: true
      }).then(async stream => {
          // stream should be streamed via WebRTC to a server
          console.log("before start recording")
          const recordedChunks = await startRecording(stream, 60000);
          console.log("after start recording")
          let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
          const recording = document.createElement("video");
          recording.src = URL.createObjectURL(recordedBlob);
          const downloadButton = document.createElement("a");
          downloadButton.href = recording.src;
          downloadButton.download = "RecordedVideo.webm";    
          downloadButton.click();
          console.log("after download button click")
      })
      
  `);
        console.log(response);
        driver.sleep(1000000);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let driver = yield getDriver();
        yield openMeet(driver);
        yield startScreenshare(driver);
    });
}
main();
