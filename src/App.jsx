import React, { memo, useState } from 'react';
import { Input, Form, Button, message, Modal } from 'antd';
import { debounce } from 'lodash';
import axios from 'axios';
import AppWrap from './style';

const App = memo(() => {
  const [messageApi, contextHolder] = message.useMessage();
  const [cardPwd] = useState((window.location.search).split('=')[1])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState({})

  function handleOpenModal() {
    setIsModalOpen(true)
  }

  function onFinish(values) {
    setFormValue(values)
  }

  function submitForm() {
    formValue.event = 'SendTextMsg';
    formValue.to_wxid = 'wxid_vihh4ys4qfqw21';
    formValue.msg = formValue.inviteLink;
    formValue.robot_wxid = 'wxid_7p6x6fdgfwzm22'
    // 将输入的内容提交到后台
    axios.post(`http://192.168.124.5:8900/autoPartTimeJob/wx/send/text/msg`, formValue).then(res => {
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
  const debounceOnFinish = debounce(submitForm, 500)


  // 提交表单且数据验证失败后回调事件
  function onFinishFailed(values) {
    console.log(values);
  }

  const handleOk = () => {
    debounceOnFinish()
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <AppWrap>
      {contextHolder}
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
        onFinish={onFinish}
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
          <Button type="primary" htmlType="submit" onClick={handleOpenModal}>
            提交
          </Button>
        </Form.Item>
      </Form>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>邀请链接：{formValue.inviteLink}</p>
        <p>是否确定提交？</p>
      </Modal>
    </AppWrap>
  )
})

export default App