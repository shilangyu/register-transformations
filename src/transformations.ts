import {
  Cardinality,
  Interface,
  Register,
  Type,
  combinations,
  eq,
  isSubtype,
} from "./register";
import { dedent } from "./utils";

type Transformations = {
  maps: {
    from: Register;
    to: Register;
  }[];
  code: string;
}[];

const transformations: Transformations = [
  {
    maps: [
      {
        from: {
          cardinality: Cardinality.Binary,
          interface: Interface.SRSW,
          type: Type.Safe,
        },
        to: {
          cardinality: Cardinality.Binary,
          interface: Interface.MRSW,
          type: Type.Safe,
        },
      },
      {
        from: {
          cardinality: Cardinality.Multivalue,
          interface: Interface.SRSW,
          type: Type.Safe,
        },
        to: {
          cardinality: Cardinality.Multivalue,
          interface: Interface.MRSW,
          type: Type.Safe,
        },
      },
      {
        from: {
          cardinality: Cardinality.Binary,
          interface: Interface.SRSW,
          type: Type.Regular,
        },
        to: {
          cardinality: Cardinality.Binary,
          interface: Interface.MRSW,
          type: Type.Regular,
        },
      },
      {
        from: {
          cardinality: Cardinality.Multivalue,
          interface: Interface.SRSW,
          type: Type.Regular,
        },
        to: {
          cardinality: Cardinality.Multivalue,
          interface: Interface.MRSW,
          type: Type.Regular,
        },
      },
    ],
    code: dedent`
			func Read()
				return Reg[i].read()
			
			func Write(v)
				for j in 1..N
					Reg[j].write(v)
		`,
  },
];

// `transformations` are like functions with covariant return types (to) and contravariant arguments (from)
// registers have a partial order (subtype relation)
// so we find the transformations steps:
// 1. construct a directed graph by expanding `transformations` with all possible subtypings (nodes are registers, edges are transformations)
// 2. expand the graph with implicit conversions: weakening (a transformation of a register to a subtype)
// 3. find shortest path between two registers
const graph = (() => {
  const adjList: [Register, { target: Register; code: string }[]][] = [];
  // don't be smart about it, its a really small graph, just do it the easy way
  for (const reg of combinations) {
    const targets = [];

    for (const transformation of transformations) {
      for (const map of transformation.maps) {
        // check if reg is supertype of map.from (contravariant argument)
        if (isSubtype(map.from, reg)) {
          // get all subtypes of this map (covariant return type)
          for (const target of combinations) {
            if (isSubtype(target, map.to)) {
              targets.push({ target, code: transformation.code });
            }
          }
        }
      }
    }

    adjList.push([reg, targets]);
  }

  return adjList;
})();

// this should be a connected graph with all register combinations as nodes, asserting that just to make sure
console.assert(
  graph.length ===
    Object.keys(Cardinality).length *
      Object.keys(Interface).length *
      Object.keys(Type).length
);

export type TransformationStep = {
  from: Register;
  to: Register;
  code: string;
};
export type TransformationSteps =
  | TransformationStep[]
  | "same register"
  | "weakening";

export const findTransformation = (
  from: Register,
  to: Register
): TransformationSteps => {
  if (eq(from, to)) {
    return "same register";
  } else if (isSubtype(to, from)) {
    return "weakening";
  }

  // BFS
  const visited: Register[] = [];
  const hasVisited = (register: Register) =>
    visited.find((e) => eq(e, register)) !== undefined;

  const queue: { node: Register; path: TransformationStep[] }[] = [
    { node: from, path: [] },
  ];

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    if (eq(node, to)) {
      return path;
    }

    const neighbors = graph.find(([reg]) => eq(reg, node))![1];
    for (const neighbor of neighbors) {
      if (hasVisited(neighbor.target)) continue;
      visited.push(neighbor.target);

      queue.push({
        node: neighbor.target,
        path: [
          ...path,
          { from: node, to: neighbor.target, code: neighbor.code },
        ],
      });
    }
  }

  // No path found
  return [];
};
