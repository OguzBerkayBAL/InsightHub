import React from "react";
import { Button, Form, Input, message } from "antd";

const DissertationCreate = () => {
  const [form] = Form.useForm();

  const addDissertation = (values) => {
    console.log(values); // Formdan gelen değerleri konsola yazdır
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/dissertation", {
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
        message.success("Tez başarıyla eklendi!");
        form.resetFields(); // Formu sıfırla
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Tez eklenirken bir hata oluştu!");
      });
  };

  const onFinish = (values) => {
    addDissertation(values);
  };

  return (
    <Form name="dissertationForm" layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="Tez Başlığı"
        name="title"
        rules={[
          {
            required: true,
            message: "Lütfen tez başlığını girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Yazar"
        name="author"
        rules={[
          {
            required: true,
            message: "Lütfen yazar adını girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tez Türü"
        name="dissertationType"
        rules={[
          {
            required: true,
            message: "Lütfen tez türünü girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tez Linki"
        name="dissertationLink"
        rules={[
          {
            required: true,
            message: "Lütfen tez linkini girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Üniversite"
        name="university"
        rules={[
          {
            required: true,
            message: "Lütfen üniversite adını girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Ülke"
        name="country"
        rules={[
          {
            required: true,
            message: "Lütfen ülke adını girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Yayın Tarihi"
        name="publicationDate"
        rules={[
          {
            required: true,
            message: "Lütfen yayın tarihini girin!",
          },
        ]}
      >
        <Input type="date" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Oluştur
      </Button>
    </Form>
  );
};

export default DissertationCreate;
