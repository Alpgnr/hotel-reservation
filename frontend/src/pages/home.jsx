import React from "react";

export default function Home({ onNavigate }) {

  const cards = [
    {
      id: "rooms",
      title: "Odalar",
      description: "Oda listesini görüntüleyin, fiyat ve kapasite bilgilerine ulaşın.",
      label: "Odaları Görüntüle",
    },
    {
      id: "bookroom",
      title: "Rezervasyon Yap",
      description: "Misafir için yeni rezervasyon oluşturun.",
      label: "Yeni Rezervasyon",
    },
    {
      id: "reservations",
      title: "Rezervasyonlar",
      description: "Mevcut rezervasyonları listeleyin ve iptal işlemlerini yapın.",
      label: "Rezervasyonları Aç",
    },
  ];
  
  return (
    <div className="home-page">
      <section className="home-header">
        <h1>Hoş geldiniz</h1>
        <p className="home-paragraph">
          Otel rezervasyon paneline hoş geldiniz. Aşağıdaki butonlardan işlemlerinizi hızlıca gerçekleştirebilirsiniz.
        </p>
      </section>
    </div>
  );
}
