
interface InitailData {
    exists: boolean,
    type?: "with_amount" | "without_amount",
    to?: string,
    amount?: number
}

export function parseInitialData(toParse: string | undefined): InitailData {
    if (!toParse) {
        return {exists: false}
    }

    const params = toParse.split("a")

    if(params[0] == "0") {
        return {
            exists: true,
            type: "without_amount",
            to: params[1]
        }
    }

    return {
        exists: true,
        type: "with_amount",
        to: params[1],
        amount: Number(params[2].replace("x", "."))
    }
}