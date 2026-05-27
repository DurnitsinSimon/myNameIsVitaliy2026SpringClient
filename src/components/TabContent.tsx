import React, { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { ROLE_PERMISSIONS } from '../types';
import {
  OBJECT_TYPES,
  PROJECT_STATUSES,
  INPAD_ROLES,
  DESIGN_STAGES,
  ImageItem,
  KeyValue,
  TeamMember,
} from '../types';

// ==================== SHARED ====================
const Field = ({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
      {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 7,
  border: '1px solid #D1D5DB',
  fontSize: 14,
  color: '#1F2937',
  background: '#fff',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 90,
  fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
    {children}
  </div>
);

// ==================== TAB 1: ОСНОВНОЕ ====================
export const TabMain: React.FC = () => {
  const { currentObject: obj, updateCurrentObject: upd } = useStore();
  if (!obj) return null;

  return (
    <div>
      <Row>
        <Field label="Название объекта" required>
          <input style={inputStyle} value={obj.name} onChange={(e) => upd({ name: e.target.value })} placeholder="ЖК «Северный квартал»" />
        </Field>
        <Field label="Краткое название">
          <input style={inputStyle} value={obj.shortName} onChange={(e) => upd({ shortName: e.target.value })} placeholder="Северный квартал" />
        </Field>
      </Row>
      <Row>
        <Field label="Город" required>
          <input style={inputStyle} value={obj.city} onChange={(e) => upd({ city: e.target.value })} placeholder="Москва" />
        </Field>
        <Field label="Регион">
          <input style={inputStyle} value={obj.region} onChange={(e) => upd({ region: e.target.value })} placeholder="Московская область" />
        </Field>
      </Row>
      <Field label="Адрес">
        <input style={inputStyle} value={obj.address} onChange={(e) => upd({ address: e.target.value })} placeholder="ул. Ленина, 1" />
      </Field>
      <Row>
        <Field label="Год проектирования">
          <input style={inputStyle} value={obj.yearDesign} onChange={(e) => upd({ yearDesign: e.target.value })} placeholder="2021" />
        </Field>
        <Field label="Год реализации">
          <input style={inputStyle} value={obj.yearRealized} onChange={(e) => upd({ yearRealized: e.target.value })} placeholder="2024" />
        </Field>
      </Row>
      <Row>
        <Field label="Статус проекта" required>
          <select style={selectStyle} value={obj.projectStatus} onChange={(e) => upd({ projectStatus: e.target.value })}>
            <option value="">— Выберите —</option>
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Тип объекта" required>
          <select style={selectStyle} value={obj.objectType} onChange={(e) => upd({ objectType: e.target.value })}>
            <option value="">— Выберите —</option>
            {OBJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </Row>
      <Row>
        <Field label="Роль ИНПАД" required>
          <select style={selectStyle} value={obj.inpadRole} onChange={(e) => upd({ inpadRole: e.target.value })}>
            <option value="">— Выберите —</option>
            {INPAD_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Стадия проектирования">
          <select style={selectStyle} value={obj.designStage} onChange={(e) => upd({ designStage: e.target.value })}>
            <option value="">— Выберите —</option>
            {DESIGN_STAGES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </Row>
      <Field label="Заказчик">
        <input style={inputStyle} value={obj.customer} onChange={(e) => upd({ customer: e.target.value })} placeholder="ООО «СтройГрупп»" />
      </Field>
      <Row>
        <Field label="Площадь объекта (м²)">
          <input style={inputStyle} type="number" value={obj.areaObject} onChange={(e) => upd({ areaObject: e.target.value })} placeholder="45000" />
        </Field>
        <Field label="Площадь участка (м²)">
          <input style={inputStyle} type="number" value={obj.areaSite} onChange={(e) => upd({ areaSite: e.target.value })} placeholder="8500" />
        </Field>
      </Row>
      <Field label="Этажность">
        <input style={{ ...inputStyle, maxWidth: 160 }} type="number" value={obj.floors} onChange={(e) => upd({ floors: e.target.value })} placeholder="22" />
      </Field>
    </div>
  );
};

// ==================== TAB 2: ОПИСАНИЕ ====================
export const TabDescription: React.FC = () => {
  const { currentObject: obj, updateCurrentObject: upd } = useStore();
  if (!obj) return null;

  const shortLen = obj.shortDescription.length;
  const shortMax = 500;

  return (
    <div>
      <Field label="Краткое описание" required>
        <textarea
          style={{ ...textareaStyle, minHeight: 100 }}
          value={obj.shortDescription}
          onChange={(e) => upd({ shortDescription: e.target.value })}
          maxLength={shortMax}
          placeholder="До 500 символов. Отображается в списке объектов и на превью..."
        />
        <div style={{ fontSize: 12, color: shortLen > shortMax * 0.9 ? '#EF4444' : '#9CA3AF', marginTop: 4, textAlign: 'right' }}>
          {shortLen} / {shortMax}
        </div>
      </Field>
      <Field label="Полное описание">
        <textarea
          style={{ ...textareaStyle, minHeight: 200 }}
          value={obj.fullDescription}
          onChange={(e) => upd({ fullDescription: e.target.value })}
          placeholder="Подробное описание объекта..."
        />
      </Field>
    </div>
  );
};

// ==================== TAB 3: ХАРАКТЕРИСТИКИ ====================
export const TabCharacteristics: React.FC = () => {
  const { currentObject: obj, updateCurrentObject: upd } = useStore();
  if (!obj) return null;

  const addKV = () => upd({ extraCharacteristics: [...obj.extraCharacteristics, { key: '', value: '' }] });
  const removeKV = (i: number) => upd({ extraCharacteristics: obj.extraCharacteristics.filter((_, idx) => idx !== i) });
  const updateKV = (i: number, patch: Partial<KeyValue>) => {
    const arr = [...obj.extraCharacteristics];
    arr[i] = { ...arr[i], ...patch };
    upd({ extraCharacteristics: arr });
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, color: '#374151' }}>ТЭП (технико-экономические показатели)</h3>
      <Row>
        <Field label="Общая площадь (м²)">
          <input style={inputStyle} type="number" value={obj.totalArea} onChange={(e) => upd({ totalArea: e.target.value })} />
        </Field>
        <Field label="Площадь застройки (м²)">
          <input style={inputStyle} type="number" value={obj.buildingArea} onChange={(e) => upd({ buildingArea: e.target.value })} />
        </Field>
      </Row>
      <Row>
        <Field label="Этажность">
          <input style={inputStyle} type="number" value={obj.floorsCount} onChange={(e) => upd({ floorsCount: e.target.value })} />
        </Field>
        <Field label="Количество корпусов">
          <input style={inputStyle} type="number" value={obj.buildingsCount} onChange={(e) => upd({ buildingsCount: e.target.value })} />
        </Field>
      </Row>
      <Field label="Парковочных мест">
        <input style={{ ...inputStyle, maxWidth: 200 }} type="number" value={obj.parkingSpaces} onChange={(e) => upd({ parkingSpaces: e.target.value })} />
      </Field>

      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 15, color: '#374151' }}>Дополнительные характеристики</h3>
          <button onClick={addKV} style={btnAddStyle}>+ Добавить</button>
        </div>
        {obj.extraCharacteristics.map((kv, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={kv.key}
              onChange={(e) => updateKV(i, { key: e.target.value })}
              placeholder="Параметр (напр. Квартир)"
            />
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={kv.value}
              onChange={(e) => updateKV(i, { value: e.target.value })}
              placeholder="Значение"
            />
            <button onClick={() => removeKV(i)} style={{ ...btnAddStyle, background: '#FEE2E2', color: '#DC2626', border: 'none' }}>✕</button>
          </div>
        ))}
        {obj.extraCharacteristics.length === 0 && (
          <p style={{ color: '#9CA3AF', fontSize: 13 }}>Нет дополнительных характеристик</p>
        )}
      </div>
    </div>
  );
};

// ==================== TAB 4: МЕДИА ====================
export const TabMedia: React.FC = () => {
  const { currentObject: obj, updateCurrentObject: upd, addNotification } = useStore();
  if (!obj) return null;

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      addNotification('error', 'Формат не поддерживается. Используйте JPG, PNG или WebP');
      return;
    }
    const url = URL.createObjectURL(file);
    const img: ImageItem = {
      id: `img_${Date.now()}`,
      url, preview: url,
      caption: file.name,
      order: 0,
      isMain: true,
      onSite: true,
      inPresentation: true,
      inPortfolio: true,
    };
    upd({ mainImage: img });
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImageItem[] = files.map((f, i) => ({
      id: `gimg_${Date.now()}_${i}`,
      url: URL.createObjectURL(f),
      preview: URL.createObjectURL(f),
      caption: '',
      order: obj.gallery.length + i,
      isMain: false,
      onSite: true,
      inPresentation: false,
      inPortfolio: false,
    }));
    upd({ gallery: [...obj.gallery, ...newImages] });
  };

  const updateGalleryItem = (id: string, patch: Partial<ImageItem>) => {
    upd({ gallery: obj.gallery.map((img) => img.id === id ? { ...img, ...patch } : img) });
  };

  const removeGalleryItem = (id: string) => {
    upd({ gallery: obj.gallery.filter((img) => img.id !== id) });
  };

  return (
    <div>
      {/* Main image */}
      <Field label="Главное изображение" required>
        <label style={dropZoneStyle}>
          {obj.mainImage ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={obj.mainImage.preview} alt="main" style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 8 }} />
              <span style={{ position: 'absolute', top: 6, left: 6, background: '#1C4ED8', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>Главное</span>
              <button
                onClick={(e) => { e.preventDefault(); upd({ mainImage: null }); }}
                style={{ position: 'absolute', top: 6, right: 6, background: '#EF4444', color: '#fff', border: 'none', borderRadius: 999, width: 22, height: 22, cursor: 'pointer', fontSize: 12 }}
              >✕</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🖼</div>
              <div style={{ fontSize: 14 }}>Перетащите или нажмите для выбора</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>JPG, PNG, WebP</div>
            </div>
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleMainImageUpload} style={{ display: 'none' }} />
        </label>
      </Field>

      {/* Gallery */}
      <Field label="Галерея изображений">
        <label style={{ ...dropZoneStyle, padding: '16px 20px', cursor: 'pointer' }}>
          <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>+</div>
            <div style={{ fontSize: 13 }}>Добавить изображения (множественный выбор)</div>
          </div>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
        </label>
      </Field>

      {obj.gallery.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
          {obj.gallery.map((img) => (
            <div key={img.id} style={{ background: '#F9FAFB', borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              <div style={{ position: 'relative' }}>
                <img src={img.preview} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                <button
                  onClick={() => removeGalleryItem(img.id)}
                  style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 12 }}
                >✕</button>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <input
                  style={{ ...inputStyle, fontSize: 12, padding: '5px 8px', marginBottom: 8 }}
                  value={img.caption}
                  onChange={(e) => updateGalleryItem(img.id, { caption: e.target.value })}
                  placeholder="Подпись"
                />
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { key: 'onSite', label: 'На сайт' },
                    { key: 'inPresentation', label: 'Презентация' },
                    { key: 'inPortfolio', label: 'Портфолио' },
                  ].map(({ key, label }) => (
                    <label key={key} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={img[key as keyof ImageItem] as boolean}
                        onChange={(e) => updateGalleryItem(img.id, { [key]: e.target.checked })}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== TAB 5: КОМАНДА ====================
const TEAM_ROLES = [
  'Руководитель проекта', 'ГАП', 'ГИП', 'Архитектор', 'Инженер',
  'BIM-специалист', 'Визуализатор', 'Партнёр', 'Другое',
];

export const TabTeam: React.FC = () => {
  const { currentObject: obj, updateCurrentObject: upd } = useStore();
  if (!obj) return null;

  const addMember = () => upd({ team: [...obj.team, { role: '', name: '' }] });
  const removeMember = (i: number) => upd({ team: obj.team.filter((_, idx) => idx !== i) });
  const updateMember = (i: number, patch: Partial<TeamMember>) => {
    const arr = [...obj.team];
    arr[i] = { ...arr[i], ...patch };
    upd({ team: arr });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14 }}>Все поля необязательные</p>
        <button onClick={addMember} style={btnAddStyle}>+ Добавить участника</button>
      </div>
      {obj.team.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👥</div>
          <div>Команда не заполнена</div>
        </div>
      )}
      {obj.team.map((member, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
          <select
            style={{ ...selectStyle, flex: '0 0 220px' }}
            value={member.role}
            onChange={(e) => updateMember(i, { role: e.target.value })}
          >
            <option value="">— Роль —</option>
            {TEAM_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={member.name}
            onChange={(e) => updateMember(i, { name: e.target.value })}
            placeholder="Иванов А.В."
          />
          <button onClick={() => removeMember(i)} style={{ ...btnAddStyle, background: '#FEE2E2', color: '#DC2626', border: 'none', flexShrink: 0 }}>✕</button>
        </div>
      ))}
    </div>
  );
};

// ==================== TAB 6: SEO ====================
export const TabSEO: React.FC = () => {
  const { currentObject: obj, updateCurrentObject: upd } = useStore();
  if (!obj) return null;

  const autoTitle = () => upd({ seoTitle: `${obj.name} — ИнПАД` });
  const autoSlug = () => {
    const slug = obj.name
      .toLowerCase()
      .replace(/[а-яё]/g, (c) => ({ а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e', ю: 'yu', я: 'ya' }[c] || c))
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    upd({ slug });
  };

  return (
    <div>
      <Field label="SEO-заголовок">
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} value={obj.seoTitle} onChange={(e) => upd({ seoTitle: e.target.value })} placeholder="Заголовок для поисковых систем" />
          <button onClick={autoTitle} style={btnAddStyle}>Авто</button>
        </div>
      </Field>
      <Field label="Meta description">
        <textarea
          style={{ ...textareaStyle, minHeight: 80 }}
          value={obj.metaDescription}
          onChange={(e) => upd({ metaDescription: e.target.value })}
          placeholder="Описание для поисковых систем (150–160 символов)"
          maxLength={160}
        />
        <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'right' }}>{obj.metaDescription.length} / 160</div>
      </Field>
      <Field label="ЧПУ (slug)">
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: '7px 0 0 7px', padding: '0 10px', border: '1px solid #D1D5DB', borderRight: 'none', fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>
            inpad.ru/objects/
          </div>
          <input
            style={{ ...inputStyle, borderRadius: '0 7px 7px 0', flex: 1 }}
            value={obj.slug}
            onChange={(e) => upd({ slug: e.target.value })}
            placeholder="zhk-severny-kvartal"
          />
          <button onClick={autoSlug} style={btnAddStyle}>Авто</button>
        </div>
      </Field>
    </div>
  );
};

// ==================== TAB 7: ПУБЛИКАЦИЯ ====================
export const TabPublication: React.FC = () => {
  const { currentObject: obj, publishObject, addNotification, user } = useStore();
  if (!obj) return null;

  const REQUIRED = [
    { field: 'name', label: 'Название объекта' },
    { field: 'objectType', label: 'Тип объекта' },
    { field: 'city', label: 'Город' },
    { field: 'shortDescription', label: 'Краткое описание' },
    { field: 'mainImage', label: 'Главное изображение' },
    { field: 'projectStatus', label: 'Статус проекта' },
    { field: 'inpadRole', label: 'Роль ИНПАД' },
  ];

  const missing = REQUIRED.filter((r) => {
    const v = obj[r.field as keyof typeof obj];
    return !v || (typeof v === 'string' && v.trim() === '');
  });

  const canPublish = missing.length === 0 && ROLE_PERMISSIONS[user.role].canPublish;

  const ROLE_PERMISSIONS_import = { admin: true, editor: true, viewer: false };

  return (
    <div>
      <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '20px 24px', marginBottom: 24, border: '1px solid #E5E7EB' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 15 }}>Статус публикации</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
            background: obj.publicationStatus === 'published' ? '#10B981' : obj.publicationStatus === 'pending' ? '#F59E0B' : '#9CA3AF',
          }} />
          <span style={{ fontSize: 15, color: '#374151' }}>
            {obj.publicationStatus === 'published' ? 'Опубликован на inpad.ru'
              : obj.publicationStatus === 'pending' ? 'Ожидает проверки'
              : obj.publicationStatus === 'error' ? 'Ошибка публикации'
              : 'Не опубликован'}
          </span>
        </div>
      </div>

      {missing.length > 0 && (
        <div style={{ background: '#FEF2F2', borderRadius: 10, padding: '16px 20px', marginBottom: 20, border: '1px solid #FECACA' }}>
          <h4 style={{ margin: '0 0 10px', color: '#DC2626', fontSize: 14 }}>⚠️ Не заполнены обязательные поля:</h4>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {missing.map((r) => (
              <li key={r.field} style={{ color: '#DC2626', fontSize: 14, marginBottom: 4 }}>{r.label}</li>
            ))}
          </ul>
        </div>
      )}

      {missing.length === 0 && (
        <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '16px 20px', marginBottom: 20, border: '1px solid #BBF7D0' }}>
          <p style={{ margin: 0, color: '#15803D', fontSize: 14 }}>✅ Все обязательные поля заполнены. Объект готов к публикации.</p>
        </div>
      )}

      {ROLE_PERMISSIONS_import[user.role] && (
        <button
          onClick={publishObject}
          disabled={!canPublish}
          style={{
            padding: '12px 28px',
            background: canPublish ? '#1C4ED8' : '#D1D5DB',
            color: canPublish ? '#fff' : '#9CA3AF',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: canPublish ? 'pointer' : 'not-allowed',
          }}
        >
          🚀 Проверить и опубликовать
        </button>
      )}

      {user.role === 'viewer' && (
        <p style={{ color: '#9CA3AF', fontSize: 14 }}>У вас нет прав для публикации.</p>
      )}
    </div>
  );
};

// ==================== TAB 8: ВЫГРУЗКА ====================
export const TabExport: React.FC = () => {
  const { currentObject: obj, exportObject } = useStore();
  if (!obj) return null;

  return (
    <div>
      <p style={{ color: '#6B7280', marginBottom: 28, fontSize: 14 }}>
        Файл будет сгенерирован на сервере и автоматически скачан.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => exportObject(obj.id, 'pptx')}
          style={{ ...exportBtnStyle, background: '#EFF6FF', color: '#1C4ED8', border: '1.5px solid #BFDBFE' }}
        >
          <span style={{ fontSize: 32 }}>📊</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Для презентации</div>
            <div style={{ fontSize: 13, color: '#60A5FA', marginTop: 2 }}>Скачать PPTX</div>
          </div>
        </button>
        <button
          onClick={() => exportObject(obj.id, 'docx')}
          style={{ ...exportBtnStyle, background: '#F0FDF4', color: '#15803D', border: '1.5px solid #BBF7D0' }}
        >
          <span style={{ fontSize: 32 }}>📄</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Для портфолио</div>
            <div style={{ fontSize: 13, color: '#4ADE80', marginTop: 2 }}>Скачать DOCX</div>
          </div>
        </button>
      </div>
    </div>
  );
};

// ==================== SHARED STYLES ====================
const btnAddStyle: React.CSSProperties = {
  padding: '6px 14px',
  background: '#F3F4F6',
  border: '1px solid #E5E7EB',
  borderRadius: 7,
  fontSize: 13,
  cursor: 'pointer',
  color: '#374151',
  fontWeight: 500,
  whiteSpace: 'nowrap',
};

const dropZoneStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px dashed #D1D5DB',
  borderRadius: 10,
  padding: '30px 20px',
  cursor: 'pointer',
  background: '#FAFAFA',
  transition: 'border-color 0.15s',
  minHeight: 120,
};

const exportBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '20px 28px',
  borderRadius: 12,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'opacity 0.15s',
  minWidth: 220,
};
