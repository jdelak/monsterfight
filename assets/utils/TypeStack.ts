export interface TypeStack {
    type: string;
    stack: number;
}

export const prepChoice = [
    8,7,6,5,4,3,2,1
];

export function addStacks(type: string, typeStacks: TypeStack[], newStackValue: number): void {
    const typeStack = typeStacks.find(ts => ts.type === type);
    if (typeStack) {
        typeStack.stack += newStackValue;
    } else {
        console.error(`Type "${type}" not found in typeStacks.`);
    }
}
