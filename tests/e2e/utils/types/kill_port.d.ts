declare module "kill-port" {
  export default function kill(port: number, method?: "tcp" | "udp"): Promise<unknown>;
}
