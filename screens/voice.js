// App.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from "react-native";
import * as Device from "expo-device";

let Voice; // only import on native platforms
if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Voice = require("@react-native-voice/voice").default;
}

export default function VoiceComp(){
  const [isListening, setIsListening] = useState(false);
  const [partial, setPartial] = useState("");
  const [finalText, setFinalText] = useState("");
  const [error, setError] = useState("");

  // Web Speech API refs
  const webRecRef = useRef(null);

  // ---------- Native (iOS/Android) listeners ----------
  useEffect(() => {
    if (Platform.OS === "web" || !Voice) return;

    Voice.onSpeechStart = () => setError("");
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (e) => {
      setError(String(e?.error?.message || e?.message || "Speech error"));
      setIsListening(false);
    };
    Voice.onSpeechPartialResults = (e) => {
      const txt = (e.value && e.value[0]) || "";
      setPartial(txt);
    };
    Voice.onSpeechResults = (e) => {
      const txt = (e.value && e.value[0]) || "";
      setFinalText((prev) => (prev ? prev + " " + txt : txt));
      setPartial("");
    };

    return () => {
      // clean up listeners
      try {
        Voice.destroy().then(Voice.removeAllListeners);
      } catch {}
    };
  }, []);

  // ---------- Start / Stop handlers ----------
  const start = async () => {
    setError("");

    if (Platform.OS === "web") {
      // Web Speech API fallback
      const SR =
        window.SpeechRecognition || window.webkitSpeechRecognition || null;
      if (!SR) {
        setError("Web Speech API not supported in this browser.");
        return;
      }
      const rec = new SR();
      webRecRef.current = rec;
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.continuous = true;

      rec.onresult = (event) => {
        let interim = "";
        let finalChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript + " ";
          } else {
            interim += transcript;
          }
        }
        if (interim) setPartial(interim);
        if (finalChunk) {
          setFinalText((prev) => (prev ? prev + " " + finalChunk : finalChunk));
          setPartial("");
        }
      };
      rec.onerror = (e) => {
        setError(e?.error || "Speech error");
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);

      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        setError(String(e));
      }
      return;
    }

    // Native (iOS/Android) via @react-native-voice/voice
    try {
      // You can pass locale like "en-US", "hi-IN", "en-IN", etc.
      await Voice.start("en-US");
      setIsListening(true);
    } catch (e) {
      setError(String(e?.message || e));
    }
  };

  const stop = async () => {
    if (Platform.OS === "web") {
      const rec = webRecRef.current;
      try {
        rec && rec.stop();
      } catch {}
      setIsListening(false);
      return;
    }
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      setError(String(e?.message || e));
    }
  };

  const clearText = () => {
    setPartial("");
    setFinalText("");
    setError("");
  };

  const listeningHint =
    Platform.OS === "web"
      ? "Web Speech API"
      : `${Device.osName || "Device"} • ${Platform.OS.toUpperCase()}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech to Text (Expo)</Text>
      <Text style={styles.sub}>{listeningHint}</Text>

      <View style={styles.row}>
        {!isListening ? (
          <TouchableOpacity style={[styles.btn, styles.start]} onPress={start}>
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn, styles.stop]} onPress={stop}>
            <Text style={styles.btnText}>Stop</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.btn, styles.clear]} onPress={clearText}>
          <Text style={styles.btnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {!!error && <Text style={styles.error}>⚠️ {error}</Text>}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Partial (live):</Text>
        <Text style={styles.text}>{partial || "…"}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Final result:</Text>
        <ScrollView style={{ maxHeight: 180 }}>
          <Text style={styles.final}>{finalText || "—"}</Text>
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, paddingHorizontal: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "800" },
  sub: { opacity: 0.6, marginTop: 4, marginBottom: 16 },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  start: { backgroundColor: "#1a73e8" },
  stop: { backgroundColor: "#d93025" },
  clear: { backgroundColor: "#6d7886" },
  btnText: { color: "#fff", fontWeight: "700" },
  error: { color: "#d93025", marginBottom: 8 },
  block: { marginTop: 10, padding: 12, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10 },
  blockTitle: { fontWeight: "700", marginBottom: 6 },
  text: { color: "#111827" },
  final: { color: "#111827", lineHeight: 22 },
});
