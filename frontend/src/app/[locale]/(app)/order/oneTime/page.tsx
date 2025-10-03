import { useTranslations } from "next-intl";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import OrderErr from "./orderErr.comp";

async function Page() {
	return <OrderErr />;
}

export default Page;
