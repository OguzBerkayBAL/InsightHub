import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ToolUpdate = () => {
  const { id } = useParams(); // URL'den id parametresini al
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3000/tool";
  const token = localStorage.getItem("token");

  // Mevcut tool verilerini çekme
  const getTool = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInitialValues(response.data);
      console.log("Tool Data:", response.data);
    } catch (error) {
      console.error("Error fetching tool data:", error);
      setApiError("Araç verisi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Güncelleme işlemi
  const updateTool = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        message.success("Araç başarıyla güncellendi!");
        navigate("/admin/tool"); // Güncellemeden sonra yönlendir
      } else {
        message.error("Araç güncellenirken bir hata oluştu!");
        console.error("Error Details:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Araç güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log("Form Values:", values);
    updateTool(values);
  };

  useEffect(() => {
    getTool(); // Bileşen yüklendiğinde tool verisini çek
  }, [id]);

  if (loading || !initialValues) {
    return <Spin spinning={loading}>Yükleniyor...</Spin>;
  }

  return (
    <>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>}
      <Form
        name="update-tool"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues} // Form başlangıç değerleri
      >
        <Form.Item
          label="Tool Name"
          name="toolName"
          rules={[{ required: true, message: "Lütfen araç adını girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tool Link"
          name="toolLink"
          rules={[{ required: true, message: "Lütfen araç linkini girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tool Description"
          name="toolDescription"
          rules={[{ required: true, message: "Lütfen araç açıklamasını girin!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Güncelle
        </Button>
      </Form>
    </>
  );
};

export default ToolUpdate;
