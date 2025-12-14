


import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import * as Device from "expo-device";
// import Voice from "react-native-voice";

let Voice; // only import on native platforms
if (Platform.OS !== "web") {
  Voice = require("@react-native-voice/voice").default;
}

export default function VoiceComp({ onFinalText }) {
  const [isListening, setIsListening] = useState(false);
  const [partial, setPartial] = useState("");
  const [finalText, setFinalText] = useState("");
  const [error, setError] = useState("");

  const webRecRef = useRef(null);

  // ---------- Native listeners ----------
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
      
      // Update local state and call the parent callback
      setFinalText((prev) => {
        const newText = prev ? prev + " " + txt : txt;
        if (onFinalText) {
          onFinalText(newText); // ⬅️ Send full new text to parent
        }
        return newText;
      });
      setPartial("");
    };

    return () => {
      try {
        Voice.destroy().then(Voice.removeAllListeners);
      } catch {}
    };
  }, [onFinalText]); // ⬅️ Add onFinalText to dependency array

  // ---------- Start / Stop handlers ----------
  const start = async () => {
    setError("");

    if (Platform.OS === "web") {
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
          // Update local state and call the parent callback
          setFinalText((prev) => {
            const newText = prev ? prev + " " + finalChunk : finalChunk;
            if (onFinalText) {
              onFinalText(newText); // ⬅️ Send full new text to parent
            }
            return newText;
          });
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

    // Native (iOS/Android)
    try {
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
    // ⬅️ Optionally clear the parent's prompt when clearing
    if (onFinalText) {
        onFinalText("");
    }
  };

  const listeningHint =
    Platform.OS === "web"
      ? "Web Speech API"
      : `${Device.osName || "Device"} • ${Platform.OS.toUpperCase()}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Input</Text>
      <Text style={styles.sub}>{listeningHint}</Text>

      <View style={styles.row}>
        {!isListening ? (
          <TouchableOpacity
            style={[styles.btn, styles.start]}
            onPress={start}
          >
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, stylesVoice.stop]}
            onPress={stop}
          >
            <Text style={styles.btnText}>Stop</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.btn, stylesVoice.clear]}
          onPress={clearText}
        >
          <Text style={styles.btnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {!!error && <Text style={styles.error}>⚠️ {error}</Text>}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Live:</Text>
        <Text style={styles.text}>{partial || "…"}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Recognized text:</Text>
        <ScrollView style={{ maxHeight: 100 }}>
          <Text style={styles.final}>{finalText || "—"}</Text>
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f6f8' },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 12 },
  micBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#e2f3f3',
    borderWidth: 1,
    borderColor: '#b2e0df',
  },
  micBtnActive: {
    backgroundColor: '#fdeaea',
    borderColor: '#f5b9b9',
  },
  micText: { fontWeight: '700' },
  goBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: 'teal' },
  goText: { color: 'white', fontWeight: '700' },
  hint: { marginTop: 10, color: '#64748b' },
});

