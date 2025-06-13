import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserUpdate = () => {
  const { id } = useParams(); // URL'den kullanıcı ID'sini al
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3000/user"; // Kullanıcı API URL'si
  const token = localStorage.getItem("token");

  // Kullanıcı verilerini al
  const getUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInitialValues(response.data); // Kullanıcı verilerini form başlangıç değerlerine ata
      console.log("User Data:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setApiError("Kullanıcı verisi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı güncelleme işlemi
  const updateUser = async (values) => {
    setLoading(true);
    try {
      const response = await axios.patch(`${apiUrl}/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        message.success("Kullanıcı başarıyla güncellendi!");
        navigate("/admin/users"); // Güncelleme sonrası yönlendirme
      } else {
        message.error("Kullanıcı güncellenirken bir hata oluştu!");
        console.error("Error Details:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Kullanıcı güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log("Form Values:", values);
    updateUser(values);
  };

  useEffect(() => {
    getUser(); // Bileşen yüklendiğinde kullanıcı verilerini al
  }, [id]);

  if (loading || !initialValues) {
    return <Spin spinning={loading}>Yükleniyor...</Spin>;
  }

  return (
    <>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>}
      <Form
        name="update-user"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues} // Form başlangıç değerleri
      >
        <Form.Item
          label="Kullanıcı Adı"
          name="name"
          rules={[{ required: true, message: "Lütfen kullanıcı adını girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Lütfen email adresini girin!" },
            { type: "email", message: "Geçerli bir email adresi girin!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Rol"
          name="role"
          rules={[{ required: true, message: "Lütfen kullanıcı rolünü seçin!" }]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Güncelle
        </Button>
      </Form>
    </>
  );
};

export default UserUpdate;
