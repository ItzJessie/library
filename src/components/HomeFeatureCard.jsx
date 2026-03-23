const HomeFeatureCard = ({ title, period, meta, image, alt, toneClass = "" }) => {
    return (
        <article className={`era-card tilt-card reveal ${toneClass}`.trim()}>
            <img src={image} alt={alt} />
            <h3>{title}</h3>
            <p>{period}</p>
            <span className="card-meta">{meta}</span>
        </article>
    );
};

export default HomeFeatureCard;