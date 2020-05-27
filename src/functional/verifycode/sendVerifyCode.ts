import { DependencyContainer } from 'tsyringe';
import { ALICLOUD_TEMPLATE_CODE } from './../../app/env';
import * as AliClient from '@alicloud/pop-core';



export async function sendVerifyCode(container: DependencyContainer, phone: string, code: string) {
  const aliClient = container.resolve(AliClient);

  const params = {
    "RegionId": "cn-hangzhou",
    "PhoneNumbers": phone,
    "SignName": "Picroup",
    "TemplateCode": ALICLOUD_TEMPLATE_CODE,
    TemplateParam: `{"code":"${code}"}`
  };

  const requestOption = {
    method: 'POST'
  };

  return await aliClient.request('SendSms', params, requestOption);
}