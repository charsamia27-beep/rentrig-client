export default function SectionHeading({ eyebrow, title, sub, center = false, action = null }) {
  return (
    <div className={`mb-10 flex flex-col gap-5 md:mb-12 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={center ? "flex flex-col items-center" : ""}>
        {eyebrow && (
          <span className="section-eyebrow">
            <span className="h-[3px] w-6 rounded-full bg-primary" />
            {eyebrow}
          </span>
        )}
        <h2 className="section-title mt-3 text-balance">{title}</h2>
        {sub && <p className={`section-sub ${center ? "mx-auto" : ""}`}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
