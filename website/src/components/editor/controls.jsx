import clsx from "clsx";
import styles from "./editor.module.css";

export function FieldGroup({ title, children }) {
  return (
    <div className={styles.fieldGroup}>
      {title && <h4 className={styles.fieldGroupTitle}>{title}</h4>}
      {children}
    </div>
  );
}

export function Field({ label, help, badge, children }) {
  return (
    <label className={styles.field}>
      {label && (
        <span className={styles.fieldLabel}>
          <span>{label}</span>
          {badge}
        </span>
      )}
      {children}
      {help && <span className={styles.fieldHelp}>{help}</span>}
    </label>
  );
}

export function PreviewOnlyBadge() {
  return <span className={styles.previewBadge} title="CSS-only — does not round-trip to Adaptive Cards 1.6">Preview only</span>;
}

export function TextField({ label, value, onChange, placeholder, help, badge }) {
  return (
    <Field label={label} help={help} badge={badge}>
      <input
        className={styles.input}
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 3, help, badge }) {
  return (
    <Field label={label} help={help} badge={badge}>
      <textarea
        className={styles.textarea}
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function NumberField({ label, value, onChange, min, max, step = 1, help, badge, allowEmpty = true }) {
  return (
    <Field label={label} help={help} badge={badge}>
      <input
        className={clsx(styles.input, styles.numberInput)}
        type="number"
        value={value ?? ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "" && allowEmpty) {
            onChange(undefined);
            return;
          }
          const num = Number(raw);
          if (Number.isFinite(num)) onChange(num);
        }}
      />
    </Field>
  );
}

export function SelectField({ label, value, onChange, options, help, badge, allowEmpty = false }) {
  return (
    <Field label={label} help={help} badge={badge}>
      <select
        className={styles.select}
        value={value ?? ""}
        onChange={(e) => {
          const next = e.target.value;
          if (next === "" && allowEmpty) onChange(undefined);
          else onChange(next);
        }}
      >
        {allowEmpty && <option value="">— default —</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ColorField({ label, value, onChange, help, badge }) {
  const safeValue = value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#50e6ff";
  return (
    <Field label={label} help={help} badge={badge}>
      <div className={styles.colorRow}>
        <input
          aria-label={`${label} color picker`}
          className={styles.colorSwatch}
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          value={value ?? ""}
          placeholder="#50e6ff"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Field>
  );
}

export function ToggleField({ label, value, onChange, help, badge }) {
  return (
    <Field help={help} badge={badge}>
      <label className={styles.toggle}>
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
    </Field>
  );
}

export function PillRow({ label, value, onChange, options, help, badge, allowClear = true }) {
  return (
    <Field label={label} help={help} badge={badge}>
      <div className={styles.pillRow}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={clsx(value === opt.value && styles.pillActive)}
            onClick={() => {
              if (value === opt.value && allowClear) onChange(undefined);
              else onChange(opt.value);
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

export const styles_ = styles;
