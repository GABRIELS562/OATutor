import React from "react"
import ZoomImage from "./ZoomImage";
import VideoSolutionPlayer from "./media/VideoSolutionPlayer";

const REGEX_YOUTUBE = /^((?:https?:)?\/\/)?((?:www|m)\.)?(youtube(-nocookie)?\.com|youtu.be)(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

// Pattern for video solutions with chapters: video:youtube:VIDEO_ID or video:self:URL
const REGEX_VIDEO_SOLUTION = /^video:(youtube|self):(.+)$/

export default class RenderMedia extends React.Component {
    render() {
        const url = this.props.url?.toString() || ""
        const { problemID = "", contentSource, chapters, onVideoProgress, onChapterComplete } = this.props

        // Check for video solution format first (video:youtube:ID or video:self:URL)
        const video_solution_match = url.match(REGEX_VIDEO_SOLUTION)
        if (video_solution_match) {
            const videoType = video_solution_match[1]
            const videoSource = video_solution_match[2]

            return (
                <VideoSolutionPlayer
                    videoType={videoType}
                    videoUrl={videoType === 'youtube' ? `https://www.youtube.com/watch?v=${videoSource}` : videoSource}
                    chapters={chapters || []}
                    problemId={problemID}
                    onProgress={onVideoProgress}
                    onChapterComplete={onChapterComplete}
                    showChapters={!!chapters && chapters.length > 0}
                />
            )
        }

        // Standard YouTube URL
        const yt_match = url.match(REGEX_YOUTUBE)
        if (yt_match) {
            const vid_id = yt_match[6]

            // If chapters are provided, use VideoSolutionPlayer
            if (chapters && chapters.length > 0) {
                return (
                    <VideoSolutionPlayer
                        videoType="youtube"
                        videoUrl={`https://www.youtube.com/watch?v=${vid_id}`}
                        chapters={chapters}
                        problemId={problemID}
                        onProgress={onVideoProgress}
                        onChapterComplete={onChapterComplete}
                        showChapters={true}
                    />
                )
            }

            // Simple YouTube embed for basic videos without chapters
            return <div style={{
                maxWidth: 520
            }}>
                <div style={{
                    paddingBottom: "56.25%",
                    position: "relative",
                    width: "100%"
                }}>
                    <iframe allowFullScreen={true} frameBorder={0} width={800} height={480}
                            title={"Video"}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%"
                            }}
                            src={`https://www.youtube-nocookie.com/embed/${vid_id}/?controls=1&modestbranding=1&showinfo=0&iv_load_policy=3&html5=1&fs=1&rel=0&hl=en&cc_lang_pref=en&cc_load_policy=1&start=0`}/>
                </div>
            </div>
        }

        // Self-hosted video files (.mp4, .webm)
        if (/\.(mp4|webm|ogg)$/i.test(url)) {
            const videoSrc = url.startsWith('http')
                ? url
                : `${process.env.PUBLIC_URL}/static/videos/${contentSource}/${problemID}/${url}`

            return (
                <VideoSolutionPlayer
                    videoType="self"
                    videoUrl={videoSrc}
                    chapters={chapters || []}
                    problemId={problemID}
                    onProgress={onVideoProgress}
                    onChapterComplete={onChapterComplete}
                    showChapters={!!chapters && chapters.length > 0}
                />
            )
        }

        return <ZoomImage src={`${process.env.PUBLIC_URL}/static/images/figures/${contentSource}/${problemID}/${url}`}
                          alt={`${problemID} figure`} style={{ width: "100%", objectFit: "scale-down" }}/>
    }
}
