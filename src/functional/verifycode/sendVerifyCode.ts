import { ALICLOUD_ACCESS_KEY, ALICLOUD_SECRET_KEY, ALICLOUD_TEMPLATE_CODE } from './../../app/env';
import * as AliCore from '@alicloud/pop-core';

const client = new AliCore({
  accessKeyId: ALICLOUD_ACCESS_KEY,
  accessKeySecret: ALICLOUD_SECRET_KEY,
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

export async function sendVerifyCode(phone: string, code: string) {

  const params = {
    "RegionId": "cn-hangzhou",
    "PhoneNumbers": phone,
    "SignName": "Picroup",
    "TemplateCode": ALICLOUD_TEMPLATE_CODE,
    TemplateParam: `{"code":"${code}"}`
  }

  const requestOption = {
    method: 'POST'
  };

  return await client.request('SendSms', params, requestOption);
}