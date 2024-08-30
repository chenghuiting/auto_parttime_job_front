import React, { memo, useState } from 'react';
import { Input, Form, Button, message } from 'antd';
import { debounce } from 'lodash';
import axios from 'axios';
import AppWrap from './style';

const App = memo(() => {
  const [messageApi] = message.useMessage();
  const [cardPwd] = useState((window.location.search).split('=')[1])

  function onFinish(values) {
    console.log(values);
    // 将输入的内容提交到后台
    axios.post(`http://122.51.106.147:8900/wx/send/text/msg`, values).then(res => {
      if (res.data.code === 0) {
        messageApi.open({
          type: 'success',
          content: '提交成功！',
          duration: 10,
        });
      } else {
        messageApi.open({
          type: 'error',
          content: res.data.msg,
          duration: 10,
        });
      }
    })
  }

  // 防抖
  const debounceOnFinish = debounce(onFinish, 500)


  // 提交表单且数据验证失败后回调事件
  function onFinishFailed(values) {
    console.log(values);
  }


  return (
    <AppWrap>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={debounceOnFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          cardPwd,
        }}
      >
        <Form.Item
          label="邀请链接"
          name="inviteLink"
          rules={[
            {
              required: true,
              message: '请输入邀请链接',
            },
          ]}
        >
          <Input placeholder="请输入邀请链接" />
        </Form.Item>
        <Form.Item
          label="卡密"
          name="cardPwd"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </AppWrap>
  )
})

export default App