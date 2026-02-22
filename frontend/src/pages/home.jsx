import React from "react";

export default function Home({ onNavigate }) {
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
