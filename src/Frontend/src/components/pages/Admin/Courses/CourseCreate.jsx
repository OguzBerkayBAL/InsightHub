import { Button, Form, Input, message } from "antd";
import React from "react";

const CourseCreate = () => {
  const [form] = Form.useForm();

  const addSubject = (values) => {
    console.log(values); // Formdan gelen değerler
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/subject", {
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
        message.success("Ders başarıyla eklendi!");
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Ders eklenirken bir hata oluştu!");
      });
  };

  const onFinish = (values) => {
    addSubject(values);
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      form={form}
      onFinish={onFinish} // Form submit işlemi
    >
      <Form.Item
        label="Ders Başlığı"
        name="title"
        rules={[
          {
            required: true,
            message: "Lütfen ders başlığını girin!",
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
        label="Ders Linki"
        name="subjectLink"
        rules={[
          {
            required: true,
            message: "Lütfen ders linkini girin!",
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
        label="Ders Yılı"
        name="subjectYear"
        rules={[
          {
            required: true,
            message: "Lütfen ders yılını girin!",
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

export default CourseCreate;
