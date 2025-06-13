import { Button, Form, Input, message, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Parametreleri almak için

const UpdateArticlePage = () => {
  const { id } = useParams(); // URL'den id parametresini almak
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false); // Loading durumunu kontrol etmek için
  const [apiError, setApiError] = useState(null); // API error durumu
  const apiUrl = "http://localhost:3000"; // API URL'i
  const token = localStorage.getItem("token"); // Token'ı localStorage'dan alıyoruz

  // Makale verilerini çekme
  const getArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/article/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token'ı header'a ekliyoruz
        },
      });
      const data = await response.json();
      console.log("Article Data:", data); // Veriyi konsola yazdırarak kontrol edin
      if (response.ok && data) {
        setInitialValues(data); // initialValues state'ini güncelliyoruz
      } else {
        setApiError("Makale verisi alınırken bir hata oluştu!"); // API'den gelen hata mesajını ekliyoruz
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("Makale verisi alınırken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Güncelleme işlemi
  const updateArticle = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/article/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
      console.log("API Response:", data); // API yanıtını konsola yazdırıyoruz
      console.log("Response Status:", response.status); // Yanıtın durum kodunu kontrol ediyoruz
  
      if (response.ok) {
        message.success("Makale başarıyla güncellendi!");
      } else {
        message.error(`Makale güncellenirken bir hata oluştu! Durum kodu: ${response.status}`);
        console.log("Error Details:", data); // Yanıtın içeriğini yazdırarak hata mesajını detaylı inceleyin
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Makale güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };
  
  const onFinish = (values) => {
    console.log("Form Values:", values); // Güncellenen form verisini loglayarak kontrol edin
    updateArticle(values); // Güncelleme işlemini başlatıyoruz
  };

  useEffect(() => {
    getArticle(); // Bileşen yüklendiğinde makale verisini al
  }, [id]);

  if (loading || !initialValues) {
    return <Spin spinning={loading}>Yükleniyor...</Spin>; // Veriler yüklenene kadar loading gösterebiliriz
  }

  return (
    <>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>} {/* Hata mesajını göster */}
      <Form
        name="update-article"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues} // initialValues doğrudan Form'a ekliyoruz
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

        <Button type="primary" htmlType="submit" loading={loading}>
          Güncelle
        </Button>
      </Form>
    </>
  );
};

export default UpdateArticlePage;
