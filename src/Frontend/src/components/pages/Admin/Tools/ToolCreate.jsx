import React from "react";
import { Button, Form, Input, message } from "antd";

const ToolCreate = () => {
  const [form] = Form.useForm();

  const addTool = (values) => {
    console.log(values); // Formdan gelen değerleri konsola yazdır
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/tool", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        message.success("Tool başarıyla eklendi!");
        form.resetFields(); // Formu sıfırla
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Tool eklenirken bir hata oluştu!");
      });
  };

  const onFinish = (values) => {
    addTool(values);
  };

  return (
    <Form name="toolForm" layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="Tool Adı"
        name="toolName"
        rules={[
          {
            required: true,
            message: "Lütfen tool adını girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tool Açıklaması"
        name="toolDescription"
        rules={[
          {
            required: true,
            message: "Lütfen tool açıklamasını girin!",
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Tool Linki"
        name="toolLink"
        rules={[
          {
            required: true,
            message: "Lütfen tool linkini girin!",
          },
          {
            type: "url",
            message: "Lütfen geçerli bir URL girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Oluştur
      </Button>
    </Form>
  );
};

export default ToolCreate;
