import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      id: "rooms",
      path: "/rooms",
      title: "Odalar",
      description: "Oda listesini görüntüleyin, fiyat ve kapasite bilgilerine ulaşın.",
      label: "Odaları Görüntüle",
    },
    {
      id: "bookroom",
      path: "/bookroom",
      title: "Rezervasyon Yap",
      description: "Misafir için yeni rezervasyon oluşturun.",
      label: "Yeni Rezervasyon",
    },
    {
      id: "reservations",
      path: "/reservations",
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

      <section className="home-cards">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="home-card"
            onClick={() => navigate(card.path)}
          >
            <h3 className="home-card-title">{card.title}</h3>
            <p className="home-card-desc">{card.description}</p>
            <span className="home-card-action">{card.label} →</span>
          </button>
        ))}
      </section>
    </div>
  );
}
