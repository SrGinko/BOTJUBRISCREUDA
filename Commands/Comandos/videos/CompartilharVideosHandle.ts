import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MessageFlags, TextDisplayBuilder, TextDisplayComponent } from "discord.js"

export default async function CompartilharVideosHandle(customId: string, interaction: any) {
    const videoUrl = interaction.fields.getTextInputValue('video-url')
    const videoDescription = interaction.fields.getTextInputValue('video-description')
    const canalId = interaction.fields.getStringSelectValues('canaltexto')[0]
    const guild = interaction.guild

    const API_URL = "https://api.interapi.dev/api/v1/instagram";
    const MAX_BYTES = 24 * 1024 * 1024;

    interface InstagramMedia {
        type?: string;
        url?: string;
        download_url?: string;
        quality?: string;
    }

    interface InstagramResponse {
        status?: string;
        media?: InstagramMedia[];
        video_url?: string | null;
        video_hd_url?: string | null;
    }

    function isInstagramUrl(value: string): boolean {
        try {
            const url = new URL(value);

            return (
                url.protocol === "https:" &&
                ["instagram.com", "www.instagram.com", "m.instagram.com"]
                    .includes(url.hostname) &&
                ["/p/", "/reel/", "/reels/", "/tv/"]
                    .some((prefix) => url.pathname.startsWith(prefix))
            );
        } catch {
            return false;
        }
    }


    async function downloadInstagramVideo(url: string): Promise<Buffer> {
        const parsed = new URL(url);

        const allowedHost =
            parsed.hostname === "cdninstagram.com" ||
            parsed.hostname.endsWith(".cdninstagram.com") ||
            parsed.hostname === "fbcdn.net" ||
            parsed.hostname.endsWith(".fbcdn.net");

        if (parsed.protocol !== "https:" || !allowedHost) {
            throw new Error("Domínio de vídeo não permitido.");
        }

        const response = await fetch(url, {
            signal: AbortSignal.timeout(60_000),
        });

        if (!response.ok || !response.body) {
            throw new Error("Erro ao baixar o vídeo.");
        }

        const contentType = response.headers.get("content-type") ?? "";

        if (!contentType.toLowerCase().startsWith("video/")) {
            throw new Error(`Arquivo retornado não é vídeo: ${contentType}`);
        }

        const length = Number(response.headers.get("content-length") ?? 0);

        if (length > MAX_BYTES) {
            throw new Error("O vídeo excede o limite de 24 MB.");
        }

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let total = 0;

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                total += value.byteLength;

                if (total > MAX_BYTES) {
                    await reader.cancel();
                    throw new Error("O vídeo excede o limite de 24 MB.");
                }

                chunks.push(value);
            }
        } finally {
            reader.releaseLock();
        }

        return Buffer.concat(chunks);
    }


    if (!isInstagramUrl(videoUrl)) {
        await interaction.reply({ content: "URL inválida. Certifique-se de que é um link do Instagram.", flags: MessageFlags.Ephemeral });
        return;
    }

    await interaction.deferReply({
        flags: MessageFlags.Ephemeral
    });

    try {
        if (!process.env.INTERAPI_KEY) {
            throw new Error("Chave da InterAPI não configurada.");
        }

        const endpoint = new URL(API_URL);
        endpoint.searchParams.set("url", videoUrl);

        const apiResponse = await fetch(endpoint, {
            headers: {
                "X-API-Key": process.env.INTERAPI_KEY
            },
            signal: AbortSignal.timeout(60_000),
        });

        if (!apiResponse.ok) {
            throw new Error(
                `Erro na InterAPI: ${apiResponse.status} - ${apiResponse.statusText}`
            );
        }

        const result = await apiResponse.json() as InstagramResponse;

        if (result.status !== "success") {
            throw new Error("A API não conseguiu processar essa publicação.");
        }

        const video = result.media?.find(
            item => item.type === "video" && item.url
        );

        const videoUrlDownload =
            result.video_hd_url ||
            result.video_url ||
            video?.url;

        if (!videoUrlDownload) {
            throw new Error("Nenhum vídeo foi encontrado nessa publicação.");
        }

        // Baixa o arquivo usando a URL retornada pela API.
        const buffer = await downloadInstagramVideo(videoUrlDownload);

        if (!guild || !canalId) {
            throw new Error("Selecione um canal válido.");
        }

        const channel = await guild.channels.fetch(canalId);

        if (!channel?.isTextBased() || !channel.isSendable()) {
            throw new Error("O canal selecionado não está disponível.");
        }

        const container = new ContainerBuilder();

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `${interaction.user} enviou um vídeo:\n`
            })
        );

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: videoDescription || "Vídeo compartilhado."
            })
        );

        const attachment = new AttachmentBuilder(buffer, {
            name: "video.mp4"
        });

        container.addMediaGalleryComponents(
            new MediaGalleryBuilder({
                items: [
                    {
                        media: {
                            url: "attachment://video.mp4"
                        }
                    }
                ]
            })
        );

        container.addActionRowComponents(
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder({
                    label: "Abrir o Video",
                    style: ButtonStyle.Link,
                    url: videoUrl
                })
            )
        );

        await channel.send({
            components: [container],
            files: [attachment],
            flags: MessageFlags.IsComponentsV2
        });

        await interaction.editReply({
            content: `✅ Vídeo enviado com sucesso para <#${canalId}>!`
        });

    } catch (error) {
        console.error("[CompartilharVideos]", error);

        const message = error instanceof Error
            ? error.message
            : "Erro desconhecido.";

        await interaction.editReply({
            content: `❌ Não foi possível compartilhar o vídeo: ${message}`
        });
    }

}