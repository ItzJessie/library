import { Link } from "react-router-dom";

const ProfileCard = ({ profile, type }) => {
    const isCreator = type === "creator";

    return (
        <article className={`info-card ${isCreator ? "creator-card" : "studio-card"}`}>
            <div className="info-header">
                <div>
                    <p className="info-label">
                        {isCreator ? "Creator Name" : "Studio Name"}: {profile.name}
                    </p>
                    <p className="info-meta">{isCreator ? profile.role : profile.meta}</p>
                </div>
                <img
                    src={`${process.env.PUBLIC_URL}/${profile.image}`}
                    alt={`${profile.name} ${isCreator ? "portrait" : "logo"}`}
                />
            </div>
            {isCreator && <p className="info-sub">{profile.affiliation}</p>}
            <p className="info-body">Notable Works: {profile.detail}</p>
            <div className="related-series">
                <span>Related series:</span>
                {profile.related.map((name) => (
                    <Link key={`${profile.name}-${name}`} to="/all-influential-series">
                        {name}
                    </Link>
                ))}
            </div>
        </article>
    );
};

export default ProfileCard;