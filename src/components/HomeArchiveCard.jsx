const HomeArchiveCard = ({ title, subtitle, detail, image, alt, wide = false }) => {
    return (
        <article className={`archive-card tilt-card reveal ${wide ? "wide" : ""}`.trim()}>
            <img src={image} alt={alt} />
            <div>
                <h3>{title}</h3>
                <p>{subtitle}</p>
                <span>{detail}</span>
            </div>
        </article>
    );
};

export default HomeArchiveCard;