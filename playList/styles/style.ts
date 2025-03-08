import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  indexContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 140,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    gap: 100,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
  },
  formContainer: {
    padding: 20,
    gap: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  signUpText: {
    textAlign: "center",
    color: "#1DB954",
    fontWeight: "bold",
  },
  myButton: {
    backgroundColor: "#1DB954",
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  myButtonText: {
    fontSize: 16,
    color: "white",
  },

  // Dashboard styles
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dashboardHeader: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#1DB954",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  tileText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 17,
    fontWeight: "bold",
  },

  // Songs Component Styles
  safeAreaContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  songDetails: {
    flex: 1,
    marginLeft: 10,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  songArtist: {
    color: "gray",
  },
  playButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  }
});
