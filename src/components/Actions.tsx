import Image from 'next/image'
import Link from "next/link";


const Actions = ({wallet}: { wallet: string }) => {
    const imgSize = 56

    return <div className='flex flex-row items-center justify-center gap-10 w-100'>
        <Link
            className="flex flex-col gap-1 justify-center items-center cursor-pointer active:bg-stone-200 rounded-lg p-4 transition-colors"
            href={"/send"}
        >
            <Image
                src="/send.svg"
                alt="Send"
                width={imgSize}
                height={imgSize}
            />
            <p>Send</p>
        </Link>
        <Link href={"/receive"}>
        <div className="flex flex-col gap-1 justify-center items-center cursor-pointer active:bg-stone-200 rounded-lg p-4 transition-colors">
            <Image
                src="/recieve-external.svg"
                alt="Receive"
                width={imgSize}
                height={imgSize}
            />
            <p>Receive</p>
        </div>
        </Link>
    </div>
}

export default Actions