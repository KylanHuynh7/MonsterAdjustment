/** Pill for a pre-registered verdict. Positive findings fill blue, negative ones outline red. */
const YES = /^(supported|meaningful|typical|hit|pass|stuff not shown to decline|supported \(expands\))/i;
const NO = /^(not supported|contradicted|not meaningful|miss|fail)/i;

export default function Verdict({ text }: { text: string }) {
  if (!text) return null;
  const cls = NO.test(text) ? "no" : YES.test(text) ? "yes" : "open";
  return <span className={`verdict ${cls}`}>{text}</span>;
}
