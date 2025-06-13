import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";

const CreateArticlePage = () => {
  const [form] = Form.useForm();

  const AddArticle = (values) => {
    console.log(values); // formdan gelen değerler
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/article", {
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
        message.success("Makale başarıyla eklendi!");
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Makale eklenirken bir hata oluştu!");
      });
  };

  const onFinish = (values) => {
    AddArticle(values);
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      form={form}
      onFinish={onFinish} // Formun submit olayı
    >
      <Form.Item
        label="Makale Başlığı"
        name="title"
        rules={[
          {
            required: true,
            message: "Lütfen makale başlığını girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Kategori"
        name="category"
        rules={[
          {
            required: true,
            message: "Lütfen kategori seçin!",
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
        label="DOI"
        name="DOI"
        rules={[
          {
            required: true,
            message: "Lütfen DOI'yi girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Arxiv Linki"
        name="archiveLink"
        rules={[
          {
            required: true,
            message: "Lütfen arxiv linkini girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Özet"
        name="summary"
        rules={[
          {
            required: true,
            message: "Lütfen özet girin!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Yayın Tarihi"
        name="publicationDate"
      >
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Oluştur
      </Button>
    </Form>
  );
};

export default CreateArticlePage;
