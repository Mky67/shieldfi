export default function Seal({ tone = "vault" }) {
  return (
    <span className={`seal${tone === "seal" ? " seal--seal" : ""}`} role="img" aria-label="sealed">
      <span className="seal-inner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L4 5V11C4 16 7.4 20.4 12 22C16.6 20.4 20 16 20 11V5L12 2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M8.5 12L11 14.5L15.5 9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}
