import React from "react";
import { Button, Form, Input, message } from "antd";

const DatasetCreate = () => {
  const [form] = Form.useForm();

  const addDataset = (values) => {
    console.log(values); // Formdan gelen değerleri konsola yazdır
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/dataset", {
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
        message.success("Dataset başarıyla eklendi!");
        form.resetFields(); // Formu sıfırla
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Dataset eklenirken bir hata oluştu!");
      });
  };

  const onFinish = (values) => {
    addDataset(values);
  };

  return (
    <Form name="datasetForm" layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="Dataset Adı"
        name="datasetName"
        rules={[{ required: true, message: "Lütfen dataset adını girin!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dataset Linki"
        name="datasetLink"
        rules={[
          { required: true, message: "Lütfen dataset linkini girin!" },
          { type: "url", message: "Geçerli bir URL girin!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dataset Açıklaması"
        name="datasetDescription"
        rules={[{ required: true, message: "Lütfen dataset açıklamasını girin!" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Dataset Tipi"
        name="datasetType"
        rules={[{ required: true, message: "Lütfen dataset tipini girin!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dataset Yılı"
        name="datasetYear"
        rules={[
          { required: true, message: "Lütfen dataset yılını girin!" },
         
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dataset Formatı"
        name="datasetFormat"
        rules={[{ required: true, message: "Lütfen dataset formatını girin!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dil"
        name="language"
        rules={[{ required: true, message: "Lütfen dataset dilini girin!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Boyut"
        name="size"
        rules={[{ required: true, message: "Lütfen dataset boyutunu girin!" }]}
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

export default DatasetCreate;
