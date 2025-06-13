import { Button, Form, Input, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";

const BenchmarkUpdate = () => {
  const { id } = useParams(); // URL'den id parametresini alıyoruz
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [benchmark, setBenchmark] = useState(null); // API'den alınan veri
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Veri çekme işlemi
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/benchmark/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("API'den veri alınırken bir hata oluştu!");
        }
        return response.json();
      })
      .then((data) => {
        setBenchmark(data); // API'den gelen veri ile formu başlatıyoruz
        form.setFieldsValue(data); // formun değerlerini API'den gelen verilerle güncelle
      })
      .catch((error) => {
        console.error("Error:", error);
        setApiError(error.message || "Benchmark verisi alınırken bir hata oluştu!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, form]);

  // Güncelleme işlemi
  const updateBenchmark = (values) => {
    setLoading(true);
    fetch(`http://localhost:3000/benchmark/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        console.log("Response:", response);  // API yanıtını konsola yazdır
        if (!response.ok) {
          throw new Error("Benchmark güncellenirken bir hata oluştu!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);  // API'den gelen başarı yanıtını konsola yazdır
        message.success("Benchmark başarıyla güncellendi!");
        navigate("/admin/benchmarks"); // Başarıyla güncellendikten sonra yönlendirme
      })
      .catch((error) => {
        console.error("Error:", error);  // Hata durumunda konsola yazdır
        message.error(error.message || "Benchmark güncellenirken bir hata oluştu!");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const onFinish = (values) => {
    updateBenchmark(values); // Formdan gelen verilerle güncelleme yap
  };

  if (loading || !benchmark) {
    return <Spin spinning={loading}>Yükleniyor...</Spin>; // Veri yüklenirken bekleyin
  }

  return (
    <Form name="update" layout="vertical" form={form} onFinish={onFinish}>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>} {/* Hata mesajı */}
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
        <Input />
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

      <Button type="primary" htmlType="submit" loading={loading}>
        Güncelle
      </Button>
    </Form>
  );
};

export default BenchmarkUpdate;
