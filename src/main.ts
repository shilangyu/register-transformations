import { Cardinality, Interface, Register, Type, describe } from "./register";
import "./style.css";
import { TransformationStep, findTransformation } from "./transformations";

// Get getters for register configuration
const register = (name: string): Register => ({
  get cardinality() {
    const value = document.querySelector<HTMLInputElement>(
      `input[name="${name}-cardinality"]:checked`
    )!.value;
    return value as Cardinality;
  },
  get interface() {
    const value = document.querySelector<HTMLInputElement>(
      `input[name="${name}-interface"]:checked`
    )!.value;
    return value as Interface;
  },
  get type() {
    const value = document.querySelector<HTMLInputElement>(
      `input[name="${name}-type"]:checked`
    )!.value;
    return value as Type;
  },
});

const base = register("base");
const target = register("target");

const printStep = (step: TransformationStep) => {
  const keywords = ["return", "func", "if", "«init»", "for", "in"];
  const registers = ["RReg", "WReg", "Reg"];

  let code = step.code;
  for (const keyword of keywords) {
    code = code.split(keyword).join(`<span class="keyword">${keyword}</span>`);
  }
  for (const register of registers) {
    code = code
      .split(register)
      .join(`<span class="register">${register}</span>`);
  }

  return `<pre><code>${code}</code></pre>`;
};

// Updates the transformation showcase
const onInputChange = () => {
  const transformation =
    document.querySelector<HTMLDivElement>("#transformation")!;

  const path = findTransformation(base, target);

  switch (path) {
    case "same register":
      transformation.innerHTML = `Base and target register are the same kind of register.`;
      break;
    case "weakening":
      transformation.innerHTML = `The base register is strictly stronger than the target register.`;
      break;
    default:
      if (path.length == 0) {
        transformation.innerHTML = `<span class="error">No transformation found. This is most likely an error, please report it in the repository.</span>`;
        break;
      } else if (path.length == 1) {
        transformation.innerHTML = printStep(path[0]);
        break;
      }

      transformation.innerHTML = transformation!.innerHTML = path
        .map(
          (e, i) => `
            <div>
              <h3>Step #${i + 1}: ${describe(e.from)} ⟶ ${describe(e.to)}</h3>
              ${printStep(e)}
            </div>`
        )
        .join("");
      break;
  }
};

for (const ele of document.querySelectorAll("input")) {
  ele.addEventListener("input", onInputChange);
}

onInputChange();
