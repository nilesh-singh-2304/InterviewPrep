
"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { AiModel, speech } from "@/services/Glo";
import { Tutors } from "@/services/options";
import { UserButton } from "@stackframe/stack";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Chatbox from "./_components/chatbox";

const DiscussionRoom = () => {
  const { roomid } = useParams();
  const [tutor, setTutor] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [convo, setConvo] = useState([{role: "assistant", content: "Hello, how can I help you today?"},{role: "user", content: "hello"}]);
  const recognitionRef = useRef(null);
  const silenceTimeout = useRef(null);
  const [audioUrl, setaudioUrl] = useState("")
  const [loading, setloading] = useState(false)
  const [enableFeedback, setenableFeedback] = useState(false)
  const transcriptRef = useRef(""); // Store latest transcript

  const roomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
  const updateConversation = useMutation(api.DiscussionRoom.updateConvo)

  useEffect(() => {
    if (roomData) {
      const foundTutor = Tutors.find((t) => t.name === roomData.tutor);
      setTutor(foundTutor);
    }
  }, [roomData]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    transcriptRef.current = ""; // Reset transcript reference

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      let newTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        newTranscript += event.results[i][0].transcript + " ";
      }

      setTranscript(newTranscript.trim());
      transcriptRef.current = newTranscript.trim(); // Store the latest transcript safely

      // Reset silence timeout whenever speech is detected
      clearTimeout(silenceTimeout.current);
      silenceTimeout.current = setTimeout(() => {
        console.log("No speech detected for 3 seconds. Stopping...");
        stopRecording();
      }, 3000);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        console.log("Restarting Speech Recognition...");
        recognitionRef.current.start(); // Auto-restart if still recording
      }
    };

    recognitionRef.current.start();
  };

  const stopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsRecording(false);

    // Ensure transcript is added before clearing it
    if (transcriptRef.current.trim() !== "") {
      setConvo((prev) => [...prev, { role: "user", content: transcriptRef.current }]);
    }

    setloading(true)

    //calling AI model to get response

    

    console.log("Updated Convo:", convo); // Debugging to check if convo updates correctly
    setloading(false)

    setTimeout(() => {
      transcriptRef.current = ""; // Reset ref transcript after convo update
      setTranscript(""); // Now clear transcript safely
    }, 500);
  };

  useEffect(() => {
    async function fetchData() {
      if(convo[convo.length-1].role === 'user'){
        const lastTwo = convo.slice(-2); // Get the last two messages
        const resp = await AiModel(roomData?.topic,roomData?.category , lastTwo);
        console.log("AI Response:", resp.choices[0].message.content); // Debugging to check AI response

        setConvo((prev) => [...prev, { role: "assistant", content: resp.choices[0].message.content }]);
        const url = await speech(resp.choices[0].message.content, tutor.name);
        console.log(url)
        setaudioUrl(url)
      }
    }
    fetchData();
  }, [convo])

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const disconnect = async (e) => {
    e.preventDefault();
    await updateConversation({ id: roomid, conversation: convo }); 
    setenableFeedback(true)
  }

  return (
    <div className="p-32">
      <h1 className="font-bold text-3xl">{roomData?.category}</h1>
      <div className="grid grid-cols-1 gap-10 mt-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative border h-[60vh] rounded-4xl flex flex-col justify-center items-center bg-gray-200 border-black">
            {tutor && (
              <>
                <Image
                  src={tutor.avatar}
                  alt={tutor.name}
                  width={100}
                  height={100}
                  className="h-[150px] w-[150px] animate-pulse rounded-full border-gray-600 p-1 border-2"
                />
                <h2 className="text-xl font-bold">{tutor.name}</h2>
                <audio src={audioUrl} type="audio/mp3" autoPlay />
              </>
            )}
            <div className="p-5 border border-black bg-gray-300 px-10 rounded-lg absolute bottom-5 right-5">
              <UserButton />
            </div>
          </div>
          <div className="w-full mt-5 flex justify-center items-center">
            <Button onClick={handleToggleRecording} disabled={loading} variant={isRecording ? "destructive" : "default"}>
            {loading && < Loader2Icon className="animate-spin" />}
              {isRecording ? "Disconnect" : "Connect"}
            </Button>
            <Button onClick={disconnect}>Dis</Button>
          </div>
        </div>
        <div>
          <div>
            <Chatbox conversation={convo} category={roomData?.category} enableFeedback={enableFeedback} />
          </div>
          <p className="mt-5 text-md px-2 text-center">
            At the end of your conversation, we will automatically generate feedback/notes.
          </p>
        </div>
      </div>


      <div>{transcript || "Start speaking..."}</div>

      {/* Display Conversation History */}
      <div className="mt-10">
        <h2 className="font-bold text-2xl">Conversation History</h2>
        <div className="mt-5 p-5 border rounded-xl bg-gray-100">
          {convo.length === 0 ? (
            <p className="text-gray-500">No conversation recorded yet.</p>
          ) : (
            convo.map((message, index) => (
              <div key={index} className="mb-2">
                <span className="font-semibold">{message.role}:</span> {message.content}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;
