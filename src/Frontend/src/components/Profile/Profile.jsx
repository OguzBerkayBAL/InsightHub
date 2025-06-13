import React, { useState, useEffect } from "react";
import { Avatar, Card, Descriptions, Button, Divider, notification } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import "./Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        // Load user data from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setFormData({
                    name: parsedUser.name || "",
                    email: parsedUser.email || "",
                });
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        // Reset form data to original user data
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
            });
        }
    };

    const handleSave = async () => {
        // Here you would normally update the user information in the backend
        // For now, we'll just update it locally
        try {
            // Mock API call
            // const response = await fetch('http://localhost:3000/users/profile', { ...

            // Update user in state and localStorage
            const updatedUser = { ...user, ...formData };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            notification.success({
                message: "Profil Güncellendi",
                description: "Kullanıcı bilgileriniz başarıyla güncellendi.",
            });

            setEditing(false);
        } catch (error) {
            notification.error({
                message: "Hata",
                description: "Profil güncellenirken bir hata oluştu.",
            });
        }
    };

    if (!user) {
        return <div className="profile-loading">Yükleniyor...</div>;
    }

    return (
        <div className="profile-container">
            <Card
                className="profile-card"
                title={
                    <div className="profile-header">
                        <Avatar size={64} icon={<UserOutlined />} />
                        <h2>Kullanıcı Profili</h2>
                    </div>
                }
                extra={
                    editing ? (
                        <div className="edit-buttons">
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSave}
                                className="save-button"
                            >
                                Kaydet
                            </Button>
                            <Button
                                icon={<CloseOutlined />}
                                onClick={handleCancel}
                                className="cancel-button"
                            >
                                İptal
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                            className="edit-button"
                        >
                            Düzenle
                        </Button>
                    )
                }
            >
                {editing ? (
                    <div className="edit-form">
                        <div className="form-group">
                            <label htmlFor="name">İsim:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">E-posta:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled // E-posta değiştirilemez
                            />
                        </div>
                    </div>
                ) : (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="İsim">{user.name}</Descriptions.Item>
                        <Descriptions.Item label="E-posta">{user.email}</Descriptions.Item>
                        <Descriptions.Item label="Kullanıcı Rolü">
                            {user.role === "admin" ? "Yönetici" : "Kullanıcı"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Hesap Oluşturulma Tarihi">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "Bilgi bulunamadı"}
                        </Descriptions.Item>
                    </Descriptions>
                )}

                <Divider />

                <div className="account-actions">
                    <h3>Hesap İşlemleri</h3>
                    <Button
                        danger
                        onClick={() => {
                            if (window.confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
                                notification.info({
                                    message: "Bilgi",
                                    description: "Bu özellik şu anda aktif değildir.",
                                });
                            }
                        }}
                    >
                        Hesabımı Sil
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Profile; 