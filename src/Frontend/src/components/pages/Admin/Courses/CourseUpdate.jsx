import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate ile yönlendirme
import axios from "axios"; // axios ile API istekleri

const CourseUpdate = () => {
  const { id } = useParams(); // URL'den id parametresini almak
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate(); // useNavigate hook'u ile yönlendirme işlemi
  const apiUrl = "http://localhost:3000/subject";
  const token = localStorage.getItem("token");

  // Makale verilerini çekme
  const getCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInitialValues(response.data); // Başlangıç verilerini al
      console.log("Course Data:", response.data); // Veriyi kontrol etmek için
    } catch (error) {
      console.error("Error fetching course:", error);
      setApiError("Ders verisi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Güncelleme işlemi
  const updateCourse = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        message.success("Ders başarıyla güncellendi!");
        navigate("/admin/course"); // Başarıyla güncellendikten sonra kurslar sayfasına yönlendir
      } else {
        message.error(`Ders güncellenirken bir hata oluştu!`);
        console.error("Error Details:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Ders güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log("Form Values:", values); // Formdan gelen verileri kontrol et
    updateCourse(values); // Güncelleme işlemi
  };

  useEffect(() => {
    getCourse(); // Bileşen yüklendiğinde ders verisini al
  }, [id]);

  if (loading || !initialValues) {
    return <Spin spinning={loading}>Yükleniyor...</Spin>; // Yükleme durumu
  }

  return (
    <>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>} {/* Hata mesajı */}
      <Form
        name="update-course"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues} // initialValues ile formu başlat
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

        <Button type="primary" htmlType="submit" loading={loading}>
          Güncelle
        </Button>
      </Form>
    </>
  );
};

export default CourseUpdate;
