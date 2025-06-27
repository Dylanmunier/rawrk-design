import { Configurator } from "@/components/configurator";

export default function ConfiguratorPage({
  searchParams,
}: {
  searchParams?: {
    model?: string;
  };
}) {
  return <Configurator selectedModelId={searchParams?.model} />;
}
