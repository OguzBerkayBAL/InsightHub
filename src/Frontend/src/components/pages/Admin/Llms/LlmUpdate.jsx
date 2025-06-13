import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LlmUpdate = () => {
  const { id } = useParams(); // URL'den id parametresini alır
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate(); // sayfa yönlendirme için
  const apiUrl = "http://localhost:3000/llm";
  const token = localStorage.getItem("token");

  // LLM verilerini çekme fonksiyonu
  const getLlm = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInitialValues(response.data); // Başlangıç değerlerini ayarla
      console.log("LLM Data:", response.data);
    } catch (error) {
      console.error("Error fetching LLM:", error);
      setApiError("LLM verisi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Güncelleme işlemi
  const updateLlm = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        message.success("LLM başarıyla güncellendi!");
        navigate("/admin/llm"); // Güncelleme sonrası yönlendirme
      } else {
        message.error("LLM güncellenirken bir hata oluştu!");
        console.error("Error Details:", response.data);
      }
    } catch (error) {
      console.error("Error updating LLM:", error);
      message.error("LLM güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log("Form Values:", values); // Formdan gelen değerleri kontrol et
    updateLlm(values); // Güncelleme işlemini başlat
  };

  useEffect(() => {
    getLlm(); // İlk yüklemede LLM verilerini çek
  }, [id]);

  if (loading || !initialValues) {
    return <Spin spinning={loading}>Yükleniyor...</Spin>; // Yükleme durumu
  }

  return (
    <>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>} {/* Hata mesajı */}
      <Form
        name="update-llm"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues} // Form başlangıç değerleri
      >
        <Form.Item
          label="LLM İsmi"
          name="llmName"
          rules={[{ required: true, message: "Lütfen LLM ismini girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="LLM Linki"
          name="llmLink"
          rules={[{ required: true, message: "Lütfen LLM linkini girin!" }]}
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
          label="LLM Türü"
          name="llmType"
          rules={[{ required: true, message: "Lütfen LLM türünü girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="LLM Yılı"
          name="llmYear"
          rules={[{ required: true, message: "Lütfen LLM yılını girin!" }]}
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
          rules={[{ required: true, message: "Lütfen lisans bilgisini girin!" }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Güncelle
        </Button>
      </Form>
    </>
  );
};

export default LlmUpdate;
