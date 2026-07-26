import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/auth.ts";
import { getProfile } from "../api/profile.ts";
import type { VotedPaper, VotedProject } from "../types/index.ts";

export interface UserProfileState {
  isAuthenticated: boolean;
  isLoading: boolean;
  displayName: string;
  hasSetDisplayName: boolean;
  hasVoted: boolean;
  votedProject: VotedProject | null;
  hasVotedPaper: boolean;
  votedPaper: VotedPaper | null;
  sessionRemainingMs: number;
}

export type ProfileAction =
  | { type: "LOGIN_SUCCESS"; payload: { hasVoted: boolean } }
  | {
      type: "PROFILE_LOADED";
      payload: {
        displayName: string;
        hasSetDisplayName: boolean;
        hasVoted: boolean;
        votedProject: VotedProject | null;
        hasVotedPaper: boolean;
        votedPaper: VotedPaper | null;
        sessionRemainingMs: number;
      };
    }
  | { type: "UPDATE_NAME"; payload: { displayName: string } }
  | { type: "VOTE_CAST_SUCCESS"; payload: { project: VotedProject } }
  | { type: "PAPER_VOTE_CAST_SUCCESS"; payload: { paper: VotedPaper } }
  | { type: "SESSION_EXPIRED" }
  | { type: "LOGOUT" }
  | { type: "TICK_SESSION" };

const initialState: UserProfileState = {
  isAuthenticated: false,
  isLoading: true,
  displayName: "Voter",
  // Assume true until the real profile loads, so the name prompt doesn't flash for
  // voters who've already set their name while PROFILE_LOADED is still in flight.
  hasSetDisplayName: true,
  hasVoted: false,
  votedProject: null,
  hasVotedPaper: false,
  votedPaper: null,
  sessionRemainingMs: 0,
};

function profileReducer(state: UserProfileState, action: ProfileAction): UserProfileState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, isLoading: false, hasVoted: action.payload.hasVoted };
    case "PROFILE_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        displayName: action.payload.displayName,
        hasSetDisplayName: action.payload.hasSetDisplayName,
        hasVoted: action.payload.hasVoted,
        votedProject: action.payload.votedProject,
        hasVotedPaper: action.payload.hasVotedPaper,
        votedPaper: action.payload.votedPaper,
        sessionRemainingMs: action.payload.sessionRemainingMs,
      };
    case "UPDATE_NAME":
      return { ...state, displayName: action.payload.displayName, hasSetDisplayName: true };
    case "VOTE_CAST_SUCCESS":
      return { ...state, hasVoted: true, votedProject: action.payload.project };
    case "PAPER_VOTE_CAST_SUCCESS":
      return { ...state, hasVotedPaper: true, votedPaper: action.payload.paper };
    case "TICK_SESSION":
      return { ...state, sessionRemainingMs: Math.max(0, state.sessionRemainingMs - 1000) };
    case "SESSION_EXPIRED":
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

interface ProfileContextValue {
  state: UserProfileState;
  dispatch: React.Dispatch<ProfileAction>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const hasTriggeredVotingCompleteLogout = useRef(false);

  async function refreshProfile() {
    try {
      const { profile } = await getProfile();
      if (!profile) {
        dispatch({ type: "LOGOUT" });
        return;
      }
      dispatch({ type: "PROFILE_LOADED", payload: profile });
    } catch {
      dispatch({ type: "LOGOUT" });
    }
  }

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (!state.isAuthenticated) return;
    const interval = setInterval(() => {
      dispatch({ type: "TICK_SESSION" });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  useEffect(() => {
    if (state.isAuthenticated && state.sessionRemainingMs === 0 && !state.isLoading) {
      dispatch({ type: "SESSION_EXPIRED" });
    }
  }, [state.isAuthenticated, state.sessionRemainingMs, state.isLoading]);

  // Once a voter has cast both their project and research paper vote, there's nothing left
  // for them to do — end the session automatically so the device is free for the next voter.
  useEffect(() => {
    // Voter-session bookkeeping only — the admin area has its own separate auth
    // (innovote_admin_session) and must never be hijacked by a voter's completed session.
    if (location.pathname.startsWith("/admin")) return;
    if (!state.isAuthenticated) {
      hasTriggeredVotingCompleteLogout.current = false;
      return;
    }
    if (!state.hasVoted || !state.hasVotedPaper) return;
    if (hasTriggeredVotingCompleteLogout.current) return;
    hasTriggeredVotingCompleteLogout.current = true;

    logout()
      .catch(() => undefined)
      .finally(() => {
        dispatch({ type: "LOGOUT" });
        navigate("/projects?voted=complete", { replace: true });
      });
  }, [state.isAuthenticated, state.hasVoted, state.hasVotedPaper, navigate, location.pathname]);

  const value = useMemo(() => ({ state, dispatch, refreshProfile }), [state]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
