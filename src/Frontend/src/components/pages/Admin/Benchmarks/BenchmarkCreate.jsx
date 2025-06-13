import { Button, Form, Input, message } from "antd";

import "react-quill/dist/quill.snow.css";

const BenchmarkCreate = () => {
  const [form] = Form.useForm();
  const AddArticle = (values) => {
    console.log(values); // formdan gelen değerler
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/benchmark", {
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
        message.success("Benchmark başarıyla eklendi!");
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Benchmark eklenirken bir hata oluştu!");
      });
  };

  const onFinish = (values) => {
    AddArticle(values);
  };
  return (
    <Form name="basic" layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="benchmarkName"
        rules={[
          {
            required: true,
            message: "Please Enter Name!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Type"
        name="benchmarkType"
        rules={[
          {
            required: true,
            message: "Please Select Category!",
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label="Explanation"
        name="benchmarkDescription"
        rules={[
          {
            required: true,
            message: "Please Enter Explanation!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Link"
        name="benchmarkLink"
        rules={[
          {
            required: true,
            message: "Please Enter Link!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Year"
        name="benchmarkYear"
        rules={[
          {
            required: true,
            message: "Please Enter Year!",
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

export default BenchmarkCreate;
