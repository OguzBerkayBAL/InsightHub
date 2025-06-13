import React from "react";
import { Button, Form, Input, message } from "antd";

const LlmCreate = () => {
  const [form] = Form.useForm();

  const addLlm = (values) => {
    console.log(values); // Formdan gelen değerleri konsola yazdır
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/llm", {
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
        message.success("LLM başarıyla eklendi!");
        form.resetFields(); // Formu sıfırla
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("LLM eklenirken bir hata oluştu!");
      });
  };

  const onFinish = (values) => {
    addLlm(values);
  };

  return (
    <Form name="llmForm" layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="LLM Adı"
        name="llmName"
        rules={[{ required: true, message: "Lütfen LLM adını girin!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="LLM Linki"
        name="llmLink"
        rules={[
          { required: true, message: "Lütfen LLM linkini girin!" },
          { type: "url", message: "Geçerli bir URL girin!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="LLM Açıklaması"
        name="llmDescription"
        rules={[{ required: true, message: "Lütfen LLM açıklamasını girin!" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="LLM Tipi"
        name="llmType"
        rules={[{ required: true, message: "Lütfen LLM tipini girin!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="LLM Yılı"
        name="llmYear"
        rules={[
          { required: true, message: "Lütfen LLM yılını girin!" },
          
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Parametre Sayısı"
        name="parametersNumber"
        rules={[{ required: true, message: "Lütfen parametre sayısını girin!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Lisans"
        name="license"
        rules={[{ required: true, message: "Lütfen lisans adını girin!" }]}
      >
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Oluştur
      </Button>
    </Form>
  );
};

export default LlmCreate;
