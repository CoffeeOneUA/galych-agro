"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  checkSession,
  fetchContent,
  saveContent,
  uploadImage,
  logout
} from "../../lib/api";

const TABS = [
  { id: "brand", label: "Лого і фавікон" },
  { id: "texts", label: "Тексти" },
  { id: "services", label: "Послуги і фото" },
  { id: "seo", label: "SEO" },
  { id: "contact", label: "Контакти" }
];

function Toast({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}

export default function Dashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [content, setContent] = useState(null);
  const [tab, setTab] = useState("brand");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const ok = await checkSession();
      if (!ok) {
        router.replace("/login");
        return;
      }
      setAuthChecked(true);
      try {
        const data = await fetchContent();
        setContent(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [router]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }, []);

  function update(path, value) {
    setContent((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  }

  async function handleUpload(path, file) {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      update(path, url);
      showToast("Зображення завантажено");
    } catch (err) {
      showToast(err.message);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveContent(content);
      showToast("Зміни збережено");
    } catch (err) {
      showToast(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (!authChecked) return <div className="wrap">Перевірка сесії…</div>;
  if (error) return <div className="wrap error-text">{error}</div>;
  if (!content) return <div className="wrap">Завантаження…</div>;

  return (
    <div className="wrap">
      <Toast message={toast} />
      <div className="topbar">
        <div>
          <h1>Адмін-панель</h1>
          <p className="sub" style={{ margin: 0 }}>Галич Агро — керування вмістом сайту</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={handleLogout}>Вийти</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Збереження…" : "Зберегти зміни"}
          </button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "brand" && (
        <div className="card section-block">
          <div className="field">
            <label>Назва компанії (текстовий логотип)</label>
            <input
              type="text"
              value={content.brandName}
              onChange={(e) => update(["brandName"], e.target.value)}
            />
          </div>
          <ImageField
            label="Логотип"
            hint="Якщо не завантажено — показується текстовий логотип."
            value={content.images.logo}
            onUpload={(f) => handleUpload(["images", "logo"], f)}
            onClear={() => update(["images", "logo"], null)}
          />
          <ImageField
            label="Фавікон"
            hint="Квадратне зображення, наприклад 64×64 або 128×128 пікселів."
            value={content.images.favicon}
            onUpload={(f) => handleUpload(["images", "favicon"], f)}
            onClear={() => update(["images", "favicon"], null)}
          />
          <ImageField
            label="Фонове фото в шапці сайту"
            hint="Необов'язково — заміняє ілюстрацію елеватора."
            value={content.images.hero}
            onUpload={(f) => handleUpload(["images", "hero"], f)}
            onClear={() => update(["images", "hero"], null)}
          />
        </div>
      )}

      {tab === "texts" && (
        <div className="card section-block">
          <div className="field">
            <label>Мітка над заголовком</label>
            <input type="text" value={content.hero.eyebrow} onChange={(e) => update(["hero", "eyebrow"], e.target.value)} />
          </div>
          <div className="field">
            <label>Головний заголовок</label>
            <textarea value={content.hero.title} onChange={(e) => update(["hero", "title"], e.target.value)} />
          </div>
          <div className="field">
            <label>Опис під заголовком</label>
            <textarea value={content.hero.subtitle} onChange={(e) => update(["hero", "subtitle"], e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Текст кнопки 1</label>
              <input type="text" value={content.hero.cta1} onChange={(e) => update(["hero", "cta1"], e.target.value)} />
            </div>
            <div className="field">
              <label>Текст кнопки 2</label>
              <input type="text" value={content.hero.cta2} onChange={(e) => update(["hero", "cta2"], e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Показник 1 — значення</label>
              <input type="text" value={content.stats[0]?.value || ""} onChange={(e) => update(["stats", 0, "value"], e.target.value)} />
            </div>
            <div className="field">
              <label>Показник 1 — підпис</label>
              <input type="text" value={content.stats[0]?.label || ""} onChange={(e) => update(["stats", 0, "label"], e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Показник 2 — значення</label>
              <input type="text" value={content.stats[1]?.value || ""} onChange={(e) => update(["stats", 1, "value"], e.target.value)} />
            </div>
            <div className="field">
              <label>Показник 2 — підпис</label>
              <input type="text" value={content.stats[1]?.label || ""} onChange={(e) => update(["stats", 1, "label"], e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Показник 3 — значення</label>
              <input type="text" value={content.stats[2]?.value || ""} onChange={(e) => update(["stats", 2, "value"], e.target.value)} />
            </div>
            <div className="field">
              <label>Показник 3 — підпис</label>
              <input type="text" value={content.stats[2]?.label || ""} onChange={(e) => update(["stats", 2, "label"], e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Заголовок «Наша мета»</label>
            <input type="text" value={content.about.title} onChange={(e) => update(["about", "title"], e.target.value)} />
          </div>
          <div className="field">
            <label>Текст «Наша мета»</label>
            <textarea value={content.about.text} onChange={(e) => update(["about", "text"], e.target.value)} />
          </div>
          <div className="field">
            <label>Заголовок «Переваги»</label>
            <input type="text" value={content.advantagesTitle} onChange={(e) => update(["advantagesTitle"], e.target.value)} />
          </div>
          <div className="field">
            <label>Список переваг (кожна перевага з нового рядка)</label>
            <textarea
              style={{ minHeight: 150 }}
              value={content.advantages.join("\n")}
              onChange={(e) => update(["advantages"], e.target.value.split("\n"))}
              onBlur={(e) =>
                update(
                  ["advantages"],
                  e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                )
              }
            />
          </div>
          <div className="field">
            <label>Заголовок блоку співпраці</label>
            <input type="text" value={content.cta.title} onChange={(e) => update(["cta", "title"], e.target.value)} />
          </div>
          <div className="field">
            <label>Текст блоку співпраці</label>
            <textarea value={content.cta.text} onChange={(e) => update(["cta", "text"], e.target.value)} />
          </div>
          <div className="field">
            <label>Текст кнопки в блоці співпраці</label>
            <input type="text" value={content.cta.button} onChange={(e) => update(["cta", "button"], e.target.value)} />
          </div>
        </div>
      )}

      {tab === "services" && (
        <div className="card section-block">
          {content.services.map((s, i) => (
            <div className="service-block" key={i}>
              <h3>Послуга {i + 1}</h3>
              <div className="field">
                <label>Назва</label>
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => update(["services", i, "title"], e.target.value)}
                />
              </div>
              <div className="field">
                <label>Опис</label>
                <textarea
                  value={s.text}
                  onChange={(e) => update(["services", i, "text"], e.target.value)}
                />
              </div>
              <ImageField
                label="Фото послуги (необов'язково)"
                value={s.image}
                onUpload={(f) => handleUpload(["services", i, "image"], f)}
                onClear={() => update(["services", i, "image"], null)}
              />
            </div>
          ))}
        </div>
      )}

      {tab === "seo" && (
        <div className="card section-block">
          <div className="field">
            <label>Title (заголовок вкладки та результатів пошуку)</label>
            <input type="text" value={content.seo.title} onChange={(e) => update(["seo", "title"], e.target.value)} />
          </div>
          <div className="field">
            <label>Meta description</label>
            <textarea value={content.seo.description} onChange={(e) => update(["seo", "description"], e.target.value)} />
          </div>
          <div className="field">
            <label>Ключові слова (через кому)</label>
            <input type="text" value={content.seo.keywords} onChange={(e) => update(["seo", "keywords"], e.target.value)} />
          </div>
        </div>
      )}

      {tab === "contact" && (
        <div className="card section-block">
          <div className="field">
            <label>Телефон</label>
            <input type="text" value={content.contact.phone} onChange={(e) => update(["contact", "phone"], e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="text" value={content.contact.email} onChange={(e) => update(["contact", "email"], e.target.value)} />
          </div>
          <div className="field">
            <label>Адреса</label>
            <input type="text" value={content.contact.address} onChange={(e) => update(["contact", "address"], e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ImageField({ label, hint, value, onUpload, onClear }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="upload-row">
        {value && <img className="thumb" src={value} alt="" />}
        <div className="file-btn">
          Завантажити
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </div>
        {value && (
          <button className="btn btn-ghost" onClick={onClear} type="button">
            Прибрати
          </button>
        )}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}
