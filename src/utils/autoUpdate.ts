import { ElMessageBox } from "element-plus";

let lastScriptUrl: string[] | null = null;

const scriptReg = /\<script.*src=["'](?<src>[^"']+)/gm;

const extractNewScripts: () => Promise<string[]> = async () => {
  try {
    const response = await fetch(`/?_timestamp=${Date.now()}`);
    const html = await response.text();
    scriptReg.lastIndex = 0;
    let result: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = scriptReg.exec(html))) {
      result.push(match.groups!.src);
    }

    return result;
  } catch (error) {
    console.error("Failed to fetch HTML:", error);
    return [];
  }
};

const needUpdate: () => Promise<boolean> = async () => {
  const newScriptUrl = await extractNewScripts();
  if (!lastScriptUrl) {
    lastScriptUrl = newScriptUrl;
    return false;
  }

  let result = false;
  if (lastScriptUrl.length !== newScriptUrl.length) {
    result = true;
  } else {
    for (let i = 0; i < lastScriptUrl.length; i++) {
      if (lastScriptUrl[i] !== newScriptUrl[i]) {
        result = true;
        break;
      }
    }
  }

  lastScriptUrl = newScriptUrl;
  return result;
};

const duration = 30 * 1000;

export const autoRefresh: () => void = () => {
  setTimeout(async () => {
    try {
      const willUpdate = await needUpdate();
      if (willUpdate) {
        ElMessageBox.confirm("页面有更新，点击确定刷新页面?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            location.reload();
          })
          .catch(() => {});
      } else {
        autoRefresh();
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    }
  }, duration);
};
