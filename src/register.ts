export enum Cardinality {
  Binary = "Binary",
  Multivalue = "Multivalue",
}
export enum Interface {
  SRSW = "SRSW",
  MRSW = "MRSW",
  MRMW = "MRMW",
}
export enum Type {
  Safe = "Safe",
  Regular = "Regular",
  Atomic = "Atomic",
}

export interface Register {
  cardinality: Cardinality;
  interface: Interface;
  type: Type;
}

export const describe = (register: Register): string => {
  return `${register.cardinality} ${register.interface} ${register.type} register`;
};

export const combinations: Register[] = (() => {
  const registers = [];
  for (const cardinality of Object.values(Cardinality)) {
    for (const interface_ of Object.values(Interface)) {
      for (const type of Object.values(Type)) {
        registers.push({
          cardinality,
          interface: interface_,
          type,
        });
      }
    }
  }
  return registers;
})();

const isSubtypeCardinality = (a: Cardinality, b: Cardinality): boolean => {
  switch (a) {
    case Cardinality.Binary:
      return true;
    case Cardinality.Multivalue:
      return b == Cardinality.Multivalue;
  }
};

const isSubtypeInterface = (a: Interface, b: Interface): boolean => {
  switch (a) {
    case Interface.SRSW:
      return true;
    case Interface.MRSW:
      return b == Interface.MRSW || b == Interface.MRMW;
    case Interface.MRMW:
      return b == Interface.MRMW;
  }
};

const isSubtypeType = (a: Type, b: Type): boolean => {
  switch (a) {
    case Type.Safe:
      return true;
    case Type.Regular:
      return b == Type.Regular || b == Type.Atomic;
    case Type.Atomic:
      return b == Type.Atomic;
  }
};

export const isSubtype = (a: Register, b: Register): boolean => {
  return (
    isSubtypeCardinality(a.cardinality, b.cardinality) &&
    isSubtypeInterface(a.interface, b.interface) &&
    isSubtypeType(a.type, b.type)
  );
};

export const eq = (a: Register, b: Register): boolean => {
  return (
    a.cardinality == b.cardinality &&
    a.interface == b.interface &&
    a.type == b.type
  );
};
