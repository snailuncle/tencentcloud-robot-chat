const tencentcloud = require("tencentcloud-sdk-nodejs");
const config = require("./config");
// 导入对应产品模块的 client models
const TbpClient = tencentcloud.tbp.v20190627.Client;
const models = tencentcloud.tbp.v20190627.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

// 实例化一个认证对象，入参需要传入腾讯云账户 secretId，secretKey

let cred = new Credential(config.secretId, config.secretKey);

// 实例化一个http选项，可选的，没有特殊需求可以跳过。
let httpProfile = new HttpProfile();
httpProfile.reqMethod = "POST";
httpProfile.reqTimeout = 30;
httpProfile.endpoint = "tbp.tencentcloudapi.com";

// 实例化一个client选项，可选的，没有特殊需求可以跳过。
let clientProfile = new ClientProfile();
clientProfile.signMethod = "HmacSHA256";
clientProfile.httpProfile = httpProfile;

// POST 请求支持的 Content-Type 类型：

// application/json（推荐），必须使用 TC3-HMAC-SHA256 签名方法。
// application/x-www-form-urlencoded，必须使用 HmacSHA1 或 HmacSHA256 签名方法。
// multipart/form-data（仅部分接口支持），必须使用 TC3-HMAC-SHA256 签名方法。

// 实例化要请求产品（以 CVM 为例）的 client 对象
let client = new TbpClient(cred, "ap-shanghai", clientProfile);
console.log(client);

function chat(inputText, TerminalId) {
  if (!inputText) {
    throw new Error("请输入问题, whats your problem");
  }
  return new Promise((resolve, reject) => {
    // 实例化一个请求对象,并填充参数
    let req = new models.TextProcessRequest();
    req.BotEnv = config.BotEnv;
    req.BotId = config.BotId;
    req.InputText = inputText;
    req.Version = config.Version;
    req.TerminalId = TerminalId || config.TerminalId;
    // req.BotEnv = "dev";

    // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
    client.TextProcess(req, function (err, response) {
      if (err) {
        console.log(err);
        reject(err);
      }
      // 请求正常返回，打印response对象
      console.log(response.to_json_string());
      resolve(response.to_json_string());
    });
  }).catch((err) => {
    console.error(err);
  });
}

module.exports = chat;
